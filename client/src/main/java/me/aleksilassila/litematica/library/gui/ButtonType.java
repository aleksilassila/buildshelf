package me.aleksilassila.litematica.library.gui;

import fi.dy.masa.malilib.util.StringUtils;
import org.jetbrains.annotations.Nullable;

public enum ButtonType {
        PUBLISH("litematica-library.gui.button.publish");
        private final String label;
        @Nullable
        private final String hoverText;

        private ButtonType(String label) {
            this(label, (String) null);
        }

        private ButtonType(String label, @Nullable String hoverText) {
            this.label = label;
            this.hoverText = hoverText;
        }

        public String getLabel() {
            return StringUtils.translate(this.label);
        }

        @Nullable
        public String getHoverText() {
            return this.hoverText != null ? StringUtils.translate(this.hoverText) : null;
        }
    }