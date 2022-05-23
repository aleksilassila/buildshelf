package me.aleksilassila.litematica.library.mixin;

import com.mojang.authlib.minecraft.UserApiService;
import com.mojang.authlib.yggdrasil.YggdrasilAuthenticationService;
import me.aleksilassila.litematica.library.FileManager;
import me.aleksilassila.litematica.library.LitematicaMixinMod;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.RunArgs;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import java.util.UUID;

@Mixin(MinecraftClient.class)
public class MinecraftClientMixin {

    @Inject(method = "createUserApiService", at = @At("HEAD"))
    private void createUserApiService(YggdrasilAuthenticationService authService, RunArgs runArgs, CallbackInfoReturnable<UserApiService> cir) {

//        LitematicaMixinMod.api.connect(runArgs.network.session.getProfile().getId(),
//                runArgs.network.session.getAccessToken());
        LitematicaMixinMod.api.connect(UUID.fromString("09760cdd-8162-44f1-91b5-d04e48238a6c"),
                "eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQ1MjQ3MzY2MTM1OCIsImFnZyI6IkFkdWx0Iiwic3ViIjoiMDk3NjBjZGQtODE2Mi00NGYxLTkxYjUtZDA0ZTQ4MjM4YTZjIiwibmJmIjoxNjUzMjk2MDMyLCJhdXRoIjoiWEJPWCIsInJvbGVzIjpbXSwiaXNzIjoiYXV0aGVudGljYXRpb24iLCJleHAiOjE2NTMzODI0MzIsImlhdCI6MTY1MzI5NjAzMiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6IjBmMmQ2YmFiZThjNTdiOGU4MGU1ZTExYWFjNGJlZDYwIn0.Q23wjWHdClw_-VYvaanYTYUJ7C1ryq11-LynqS2-2kE");
    }
}
