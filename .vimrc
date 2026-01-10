" ==========================================
" 1. AUTO-BOOTSTRAP PLUG (Self-Installing)
" ==========================================
" This ensures that if you checkout your config on a new machine,
" it downloads the plugin manager automatically.
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

" ==========================================
" 2. PLUGINS
" ==========================================
call plug#begin()

" The Theme
Plug 'morhetz/gruvbox'

" HTML Auto Closing Tags
Plug 'alvan/vim-closetag'

call plug#end()

" ==========================================
" 3. LOOK AND FEEL
" ==========================================
" specific settings for the theme
set termguicolors
set background=dark
colorscheme gruvbox

" Cursor settings:
" 6 q = Vertical Bar (Insert Mode)
" 2 q = Block (Normal Mode)
let &t_SI = "\e[6 q"
let &t_EI = "\e[2 q"

" ==========================================
" 4. HTML SPECIFIC SETTINGS
" ==========================================
" Configure closetag to specific filetypes just in case
let g:closetag_filenames = '*.html,*.xhtml,*.phtml'

" Autocommands for HTML files
augroup htmlSettings
  autocmd!
  " Enable spellcheck (US English)
  " Enable Wrap with 'linebreak' (breaks at words) and 'breakindent' (preserves visual structure)
  autocmd FileType html setlocal spell spelllang=en_us wrap linebreak breakindent
augroup END
