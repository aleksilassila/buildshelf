package me.aleksilassila.litematica.library;

import com.google.common.collect.ImmutableList;
import fi.dy.masa.litematica.config.Configs;
import fi.dy.masa.litematica.config.Hotkeys;
import fi.dy.masa.malilib.config.IConfigBase;
import fi.dy.masa.malilib.config.options.ConfigHotkey;
import fi.dy.masa.malilib.hotkeys.IHotkeyCallback;
import fi.dy.masa.malilib.hotkeys.IKeybind;
import fi.dy.masa.malilib.hotkeys.KeyAction;
import net.fabricmc.api.ModInitializer;
import net.minecraft.client.MinecraftClient;
import net.minecraft.text.Text;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public class LitematicaMixinMod implements ModInitializer {
	public static Api api = new Api();
	public static MinecraftClient mc = MinecraftClient.getInstance();

	public static ImmutableList<IConfigBase> getConfigList() {
		List<IConfigBase> list = new java.util.ArrayList<>(Configs.Generic.OPTIONS);

		return ImmutableList.copyOf(list);
	}

	// Hotkey
	public static final ConfigHotkey SYNC_BUILDS = new ConfigHotkey("syncBuilds", "M,K", "Sync builds with Litematica Library");

	public static List<ConfigHotkey> getHotkeyList() {
		List<ConfigHotkey> list = new java.util.ArrayList<>(Hotkeys.HOTKEY_LIST);
		list.add(SYNC_BUILDS);

		return ImmutableList.copyOf(list);
	}

	public static void sendChatMessage(String message) {
		if (mc != null && mc.player != null) {
			mc.player.sendMessage(Text.of(message), false);
		}
	}

	@Override
	public void onInitialize() {
		SYNC_BUILDS.getKeybind().setCallback(new SyncBuildsCallback());
	}

	static class SyncBuildsCallback implements IHotkeyCallback {
		@Override
		public boolean onKeyAction(KeyAction action, IKeybind key) {
			CompletableFuture.runAsync(FileManager.INSTANCE::syncBuilds);
			return true;
		}
	}
}
