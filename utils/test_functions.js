test = {
    clipboardTextEquals: function(expected) {
        for (var i = 0; i < 10; ++i) {
            var actual = str(clipboard())
            if (actual == expected)
                return
            sleep(500)
        }

        throw 'Expected clipboard: ' + expected
            + '\nActual clipboard: ' + actual
    },

    startTest: function(script) {
        keys('!ClipboardBrowser')
        clipboardTextEquals('')
        eval(script)
    },

    importCommands: function(ini) {
        var commandConfigFile = new File(ini)
        if (!commandConfigFile.openReadOnly())
            throw 'Failed to open ini file: ' + ini

        var commandConfigContent = commandConfigFile.readAll()
        commandConfigFile.close()

        var commands = importCommands(commandConfigContent)
        if (commands.length == 0)
            throw 'Failed to load ini file: ' + ini

        for (var i in commands) {
            var command = commands[i]

            // Set global shortcut commands to application shortcut Ctrl+F1.
            if (command.isGlobalShortcut) {
                command.isGlobalShortcut = false
                command.shortcuts = ['Ctrl+F1']
                command.inMenu = true
            }
        }

        setCommands(commands)
    }
}

// Fail after an interval.
afterMilliseconds(10000, fail)
