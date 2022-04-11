package me.aleksilassila.litematica.library.gui;

import fi.dy.masa.litematica.gui.Icons;
import fi.dy.masa.malilib.gui.LeftRight;
import fi.dy.masa.malilib.gui.interfaces.ISelectionListener;
import fi.dy.masa.malilib.gui.widgets.WidgetListBase;
import fi.dy.masa.malilib.gui.widgets.WidgetSearchBar;
import org.jetbrains.annotations.Nullable;

public class WidgetListBuildList extends WidgetListBase<BuildListEntry, WidgetBuildListEntry> {
    public WidgetListBuildList(int x, int y, int width, int height, @Nullable ISelectionListener<BuildListEntry> selectionListener) {
        super(x, y, width, height, selectionListener);

        this.browserEntryHeight = 22;
        this.widgetSearchBar = new WidgetSearchBar(x + 2, y + 4, width - 14, 14, 0, Icons.FILE_ICON_SEARCH, LeftRight.LEFT);
        this.browserEntriesOffsetY = this.widgetSearchBar.getHeight() + 3;
    }

    @Override
    protected WidgetBuildListEntry createListEntryWidget(int x, int y, int listIndex, boolean isOdd, BuildListEntry entry) {
        return null;
    }
}
