package me.aleksilassila.litematica.library;

import fi.dy.masa.litematica.data.DataManager;

import java.io.File;
import java.nio.file.Path;

public class LitematicFile {
    public int id;
    public String filename;
    public String md5;
    public Path file;

    public LitematicFile(int id, File file) {
        this(id, file.toPath());
    }

    public LitematicFile(int id, Path file) {
        this.id = id;
        this.filename = file.getFileName().toString();
        this.file = file;
        this.md5 = FileManager.getFileMD5(file);
    }

    public LitematicFile(int id, String filename, String md5) {
        this.id = id;
        this.file = FileManager.getSchematicsDir().resolve(filename);
        this.filename = filename;
        this.md5 = md5;
    }
}
