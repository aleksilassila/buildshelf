package me.aleksilassila.litematica.library.mixin;

import com.mojang.authlib.minecraft.UserApiService;
import com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService;
import me.aleksilassila.litematica.library.Api;
import me.aleksilassila.litematica.library.FileManager;
import me.aleksilassila.litematica.library.LitematicaMixinMod;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.RunArgs;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

@Mixin(MinecraftClient.class)
public class MinecraftClientMixin {

    @Inject(method = "createUserApiService", at = @At("HEAD"))
    private void createUserApiService(YggdrasilAuthenticationService authService, RunArgs runArgs, CallbackInfoReturnable<UserApiService> cir) {
        FileManager.INSTANCE.api.connect(runArgs.network.session.getProfile().getId(),
                runArgs.network.session.getAccessToken());
    }
}
