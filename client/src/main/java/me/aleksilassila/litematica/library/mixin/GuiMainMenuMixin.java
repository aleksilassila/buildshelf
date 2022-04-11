package me.aleksilassila.litematica.library.mixin;

import fi.dy.masa.litematica.gui.GuiMainMenu;
import fi.dy.masa.litematica.gui.Icons;
import fi.dy.masa.malilib.gui.GuiBase;
import fi.dy.masa.malilib.gui.button.ButtonBase;
import fi.dy.masa.malilib.gui.button.ButtonGeneric;
import fi.dy.masa.malilib.gui.button.IButtonActionListener;
import fi.dy.masa.malilib.util.StringUtils;
import me.aleksilassila.litematica.library.interfaces.IGuiMainMenu;
import org.lwjgl.system.CallbackI;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.ModifyVariable;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@Mixin(value = GuiMainMenu.class, remap = false)
public abstract class GuiMainMenuMixin extends GuiBase implements IGuiMainMenu {
    int buttonsX = 0;
    int buttonsY = 0;

    @Inject(method = "initGui", at = @At("TAIL"))
    public void initGui(CallbackInfo ci) {
        buttonsY += 22;

        ButtonGeneric button = new ButtonGeneric(buttonsX, buttonsY,
                this.getButtonWidth(), 20,
                "litematica-library.gui.button.open_library_browser",
                Icons.FILE_ICON_SEARCH);

        button.setHoverStrings("litematica-library.gui.button.hover.open_library_browser");

        this.addButton(button, new ButtonListenerOpenLibrary());
    }

    @ModifyVariable(method = "initGui()V", at = @At("STORE"), ordinal = 0)
    private int assignX(int x) {
        buttonsX = x;
        return x;
    }

    @ModifyVariable(method = "initGui()V", at = @At("STORE"), ordinal = 1)
    private int assignY(int y) {
        buttonsY = y;
        return y;
    }

    @Inject(method = "getButtonWidth", at = @At("RETURN"), cancellable = true)
    private void getButtonWidth(CallbackInfoReturnable<Integer> cir) {
        int width = Math.max(cir.getReturnValueI(),
                this.getStringWidth(
                        StringUtils.translate(
                                "litematica-library.gui.button.open_library_browser")
                ) + 10);
        cir.setReturnValue(width);
    }

    static class ButtonListenerOpenLibrary implements IButtonActionListener {

        @Override
        public void actionPerformedWithButton(ButtonBase button, int mouseButton) {
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:3000"));
            } catch (IOException | URISyntaxException e) {
                e.printStackTrace();
            }
        }
    }
}
