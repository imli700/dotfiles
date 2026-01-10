" ==========================================
" 1. AUTO-BOOTSTRAP PLUG (Self-Installing)
" ==========================================
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

" ==========================================
" 2. PLUGINS
" ==========================================
call plug#begin()
Plug 'morhetz/gruvbox'
Plug 'alvan/vim-closetag'
call plug#end()

" ==========================================
" 3. LOOK AND FEEL & BEHAVIOR
" ==========================================
set termguicolors
set background=dark
syntax enable 
colorscheme gruvbox

" FIX: Eliminate delay when switching from Insert to Normal
set ttimeout
set ttimeoutlen=5

" Cursor: Line in Insert Mode, Block in Normal Mode
let &t_SI = "\e[6 q"
let &t_EI = "\e[2 q"

" Force SpellBad to be a visible Red Underline 
highlight SpellBad cterm=underline ctermfg=203 guifg=#ff5f5f gui=underline guisp=#ff5f5f

" ==========================================
" 4. HTML SPECIFIC SETTINGS
" ==========================================
" Ensure the spell folder exists to avoid errors
if empty(glob('~/.vim/spell'))
  call mkdir($HOME . '/.vim/spell', 'p')
endif

" Configure closetag filenames
let g:closetag_filenames = '*.html,*.xhtml,*.phtml'

augroup htmlSettings
  autocmd!
  " Enable spellcheck, wrap, and smart indentation
  autocmd FileType html setlocal spell spelllang=en_us wrap linebreak breakindent
augroup END

" ==========================================
"  TRANSPARENCY (let terminal background show through)
" ==========================================
highlight Normal       ctermbg=NONE guibg=NONE
highlight NonText      ctermbg=NONE guibg=NONE
highlight LineNr       ctermbg=NONE guibg=NONE
highlight SignColumn   ctermbg=NONE guibg=NONE
highlight EndOfBuffer  ctermbg=NONE guibg=NONE
