test.importCommands('Global/snippets.ini')

tab('Snippets')
add('Snippet 1')

keys('Ctrl+F1', 'focus:ComboBox', 'ENTER')

test.clipboardTextEquals('Snippet 1')
