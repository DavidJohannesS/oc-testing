local lsp_zero = require('lsp-zero')

lsp_zero.on_attach(function(client, bufnr)
  lsp_zero.default_keymaps({buffer = bufnr})
end)

require('mason').setup({})
require('mason-lspconfig').setup({
  -- Replace the language servers listed here
  -- with the ones you want to install
  ensure_installed = {'jdtls'},
  handlers = {
    function(server_name)
      if server_name == 'jdtls' then
        require('lspconfig')[server_name].setup{
          root_dir = function() return vim.loop.cwd() end
        }
      else
        require('lspconfig')[server_name].setup{}
      end
    end,
  }
})

