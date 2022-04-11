package me.aleksilassila.litematica.library;

import fi.dy.masa.litematica.data.DataManager;

import java.io.File;
import java.io.FileInputStream;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum FileManager {
    INSTANCE;

    public Api api = new Api();

	public static String getFileMD5(File file) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");

			DigestInputStream dis = new DigestInputStream(new FileInputStream(file), md);
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

	public void syncBuilds() {
		if (!api.isConnected())
			return;

		// Get all file hashes from server
		Map<String, String> remoteFiles = api.getRemoteBuilds();

		// Get all local file hashes
		Map<String, String> localFiles = getLocalBuilds();


		// Request changed files
		List<String> toUpdate = new ArrayList<>();
		for (String fileName : localFiles.keySet()) {
			if (!remoteFiles.containsKey(fileName)) {
				toUpdate.add(fileName);
			} else if (!remoteFiles.get(fileName).equals(localFiles.get(fileName))) {
				toUpdate.add(fileName);
			}
		}

		if (!toUpdate.isEmpty()) {
			api.updateBuilds(toUpdate);
		}
	}

	private Map<String, String> getLocalBuilds() {
		File baseDirectory = DataManager.getSchematicsBaseDirectory();
		Map<String, String> files = new HashMap<>();

		if (baseDirectory.listFiles() == null) {
			return files;
		}

		for (File file : baseDirectory.listFiles()) {
			if (file.isFile())
				files.put(file.getName(), getFileMD5(file));
		}

		return files;
	}
}
