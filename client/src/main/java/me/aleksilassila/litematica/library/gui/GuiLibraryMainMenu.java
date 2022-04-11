package me.aleksilassila.litematica.library.gui;

import fi.dy.masa.malilib.gui.GuiListBase;
import fi.dy.masa.malilib.gui.button.ButtonBase;
import fi.dy.masa.malilib.gui.button.ButtonGeneric;
import fi.dy.masa.malilib.gui.button.IButtonActionListener;

public class GuiLibraryMainMenu extends GuiListBase<BuildListEntry, WidgetBuildListEntry, WidgetListBuildList> {
    public GuiLibraryMainMenu() {
        super(12, 30);
    }

    @Override
    protected WidgetListBuildList createListWidget(int listX, int listY) {
        return new WidgetListBuildList(listX, listY, this.getBrowserWidth(), this.getBrowserHeight(), null);
    }

    @Override
    protected int getBrowserWidth() {
        return this.width - 20;
    }

    @Override
    protected int getBrowserHeight() {
        return this.height - 68;
    }

    @Override
    public void initGui() {
        super.initGui();
        this.addButton(
                new ButtonGeneric(0, 0, 100, 20, "Asd", "Hover"),
                new ButtonListener());
    }

    public static class ButtonListener implements IButtonActionListener {

        @Override
        public void actionPerformedWithButton(ButtonBase button, int mouseButton) {
            System.out.println("Clicked?, " + button.isMouseOver() + ", " + mouseButton);
        }
    }
}
