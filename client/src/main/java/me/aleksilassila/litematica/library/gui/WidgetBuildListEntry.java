package me.aleksilassila.litematica.library.gui;

import fi.dy.masa.malilib.gui.widgets.WidgetListEntrySortable;
import org.jetbrains.annotations.Nullable;

public class WidgetBuildListEntry extends WidgetListEntrySortable<BuildListEntry> {
    public WidgetBuildListEntry(int x, int y, int width, int height, @Nullable BuildListEntry entry, int listIndex) {
        super(x, y, width, height, entry, listIndex);
    }

    @Override
    protected int getColumnPosX(int column) {
        return 0;
    }

    @Override
    protected int getCurrentSortColumn() {
        return 0;
    }

    @Override
    protected boolean getSortInReverse() {
        return false;
    }
}
