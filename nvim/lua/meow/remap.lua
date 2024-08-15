vim.g.mapleader = " "
vim.api.nvim_set_keymap('n', '<space>e', '<cmd>lua vim.diagnostic.open_float(nil, { focusable = true })<CR>', {noremap = true, silent = true})
