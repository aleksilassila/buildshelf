package me.aleksilassila.litematica.library;

import fi.dy.masa.litematica.data.DataManager;
import fi.dy.masa.litematica.util.NbtUtils;
import fi.dy.masa.malilib.util.WorldUtils;
import net.minecraft.nbt.NbtCompound;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum FileManager {
    INSTANCE;

	private final Api api = LitematicaMixinMod.api;

	public static Path getSchematicsDir() {
		Path path = DataManager.getSchematicsBaseDirectory().toPath().resolve("buildshelf");

		if (!path.toFile().exists()) {
			path.toFile().mkdirs();
		}

		return path;
	}

	public void syncBuilds() {
		if (!api.isConnected()) {
			System.out.println("Api not connected!");
			return;
		} else {
			LitematicaMixinMod.sendChatMessage("Synchronizing builds...");
		}

		// Get all file hashes from server
		Map<Integer, LitematicFile> remoteFiles = api.getRemoteBuilds();

		// Get all local file hashes
		Map<Integer, LitematicFile> localFiles = getLocalBuilds();

		// Request changed files
		List<LitematicFile> toUpdate = new ArrayList<>();
		for (LitematicFile remoteFile : remoteFiles.values()) {
			if (!localFiles.containsKey(remoteFile.id)) {
				System.out.println("Remote file not found locally: " + remoteFile.id);
				toUpdate.add(remoteFile);
			} else if (!remoteFile.md5.equals(localFiles.get(remoteFile.id).md5)) {
				System.out.println("Remote file changed: " + remoteFile.id + " (" + remoteFile.md5 + ", " + localFiles.get(remoteFile.id).md5 + ")");
				toUpdate.add(remoteFile);
			} else if (!remoteFile.filename.equals(localFiles.get(remoteFile.id).filename)) {
				localFiles.get(remoteFile.id).file.toFile().renameTo(remoteFile.file.toFile());
				System.out.println("Renamed file " + remoteFile.id);
			}
		}

		LitematicaMixinMod.sendChatMessage("Updating " + toUpdate.size() + " files...");
		if (!toUpdate.isEmpty()) {
			api.fetchBuilds(toUpdate);
		}

		LitematicaMixinMod.sendChatMessage("Builds synchronized.");
	}

	private Map<Integer, LitematicFile> getLocalBuilds() {
		File[] baseDirectoryFiles = getSchematicsDir().toFile().listFiles();
		List<LitematicFile> files = new ArrayList<>();

		if (baseDirectoryFiles == null) {
			return new HashMap<>();
		}

		for (File file : baseDirectoryFiles) {
			if (file.isFile()) {
				try {
					NbtCompound nbtCompound = NbtUtils.readNbtFromFile(file);
					if (nbtCompound != null) {
						int fileId = nbtCompound.getCompound("Metadata").getInt("Id");
						if (fileId != 0) {
							files.add(new LitematicFile(fileId, file));
						}
					} else {
						System.out.println("Failed to read NBT from file: " + file.getName());
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}

		return files.stream().collect(HashMap::new, (m, e) -> m.put(e.id, e), HashMap::putAll);
	}

	public static String getFileMD5(Path path) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");

			DigestInputStream dis = new DigestInputStream(new FileInputStream(path.toFile()), md);
			while (dis.read() != -1) {}; //empty loop to clear the data
			md = dis.getMessageDigest();

			// bytes to hex
			StringBuilder result = new StringBuilder();
			for (byte b : md.digest()) {
				result.append(String.format("%02x", b));
			}
			return result.toString();
		} catch (Exception e) {
			return "";
		}
	}
}
