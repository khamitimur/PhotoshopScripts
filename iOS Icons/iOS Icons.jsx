var initialRulerUnitsPreferences = app.preferences.rulerUnits;

var exportOptionsSaveForWeb = new ExportOptionsSaveForWeb();
exportOptionsSaveForWeb.format = SaveDocumentType.PNG;
exportOptionsSaveForWeb.PNG8 = false;
exportOptionsSaveForWeb.transparency = false;

function main() {
    // Opening App Store icon selection dialog.
    var sourceFile = File.openDialog("Select App Store icon", "*.png", false);
    if (sourceFile == null)  {
        return;
    }

    // Reading source file as PNG image.
    var sourceImage = open(sourceFile, OpenDocumentType.PNG);
    if (sourceImage == null) {
        alert("Can't open an image. Please, make sure that it's a proper PNG image.");

        return;
    }

    // Changing ruler units.
    app.preferences.rulerUnits = Units.PIXELS;

    // Validating source image.
    if (sourceImage.width != sourceImage.height || sourceImage.width < 1024 || sourceImage.height < 1024) {
        alert("Please select a square PNG image that is at least 1024x1024.");

        restorePreferences();

        return;
    }

    // Opening root folder selection dialog.
    var rootFolder = Folder.selectDialog("Choose an output folder.");
    if (rootFolder == null) {
        restorePreferences();
        
        return;
    }

    // Removing metadata from source image.
    sourceImage.info = null;

    var iPhoneIcons = [
    // Notification
    {"name": "AppIcon-20@2x", "size":40},
    {"name": "AppIcon-20@3x", "size":60},

    // Settings
    {"name": "AppIcon-29@2x", "size":58},
    {"name": "AppIcon-29@3x", "size":87},

    // Spotlight
    {"name": "AppIcon-40@2x", "size":80},
    {"name": "AppIcon-40@3x", "size":120},

    // Application
    {"name": "AppIcon-60@2x", "size":120},
    {"name": "AppIcon-60@3x", "size":180},
    ]

    var iPadIcons = [
    // Notification
    {"name": "AppIcon-20@1x~ipad", "size":20},
    {"name": "AppIcon-20@2x~ipad", "size":40},

    // Settings
    {"name": "AppIcon-29@1x~ipad", "size":29},
    {"name": "AppIcon-29@2x~ipad", "size":58},

    // Spotlight
    {"name": "AppIcon-40@1x~ipad", "size":40},
    {"name": "AppIcon-40@2x~ipad", "size":80},

    // Application
    {"name": "AppIcon-76@1x~ipad", "size":76},
    {"name": "AppIcon-76@2x~ipad", "size":152},

    // iPad Pro Application
    {"name": "AppIcon-83.5@2x~ipad", "size":167},
    ]

    var appStoreIcons = [
    {"name": "AppIcon-1024@1x~ios-marketing", "size":1024},
    ];

    // Creating folder.
    var destinationFolder = createFolder(rootFolder, "Generated Icons")

    // Generating and saving icons.
    generateIcons(sourceImage, iPhoneIcons, destinationFolder)
    generateIcons(sourceImage, iPadIcons, destinationFolder)
    generateIcons(sourceImage, appStoreIcons, destinationFolder)

    alert("Done!");

    // Closing source image without saving changes.
    sourceImage.close(SaveOptions.DONOTSAVECHANGES);

    restorePreferences();
}

function generateIcons(sourceImage, icons, destinationFolder) {
    var folder = createFolder(destinationFolder, folderName)

    for (var i = 0; i < icons.length; i++) {
        generateIcon(sourceImage, icons[i], destinationFolder)
    }
}

function createFolder(rootFolder, folderName) {
    var folder = new Folder(rootFolder + "/" + folderName)
    if (!folder.exists) {
        folder.create()
    }

    return folder
}

function generateIcon(sourceImage, icon, folder) {
    // Saving active history state before generating an image.
    var initialActiveHistory = sourceImage.activeHistoryState;

    // Resizing source image.
    sourceImage.resizeImage(icon.size, icon.size, null, ResampleMethod.BICUBICSHARPER);

    // Saving resized source image.
    sourceImage.exportDocument(new File(folder + "/" + icon.name + ".png"), ExportType.SAVEFORWEB, exportOptionsSaveForWeb);

    // Reverting active history state to undo all changes for source image.
    sourceImage.activeHistoryState = initialActiveHistory;
}

function restorePreferences() {
    app.preferences.rulerUnits = initialRulerUnitsPreferences;
}

main();
