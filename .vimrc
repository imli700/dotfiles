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
" ADDED: Highlights the area you yanked for a split second (LazyVim style)
Plug 'machakann/vim-highlightedyank'
call plug#end()

" ==========================================
" 3. LOOK AND FEEL & BEHAVIOR
" ==========================================
set termguicolors
set background=dark
syntax enable 
filetype plugin indent on 
colorscheme gruvbox

" Enable Hybrid Relative Line Numbering
set number
set relativenumber

" ADDED: Configure Yank Highlight Duration (milliseconds)
" -1 = persistent, 1000 = 1 sec. 250 is usually the sweet spot.
let g:highlightedyank_highlight_duration = 250

" Eliminate delay when switching from Insert to Normal
set ttimeout
set ttimeoutlen=5

" Sync Vim clipboard with Linux System clipboard
set clipboard=unnamedplus

" Fix Wayland Clipboard Persistence (keep copied text after exit)
autocmd VimLeave * call system("wl-copy", getreg('+'))

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
  " Indentation: 2 spaces, expand tabs
  autocmd FileType html setlocal spell spelllang=en_us wrap linebreak breakindent shiftwidth=2 tabstop=2 softtabstop=2 expandtab

  " Map j/k to move visually
  autocmd FileType html nnoremap <buffer> j gj
  autocmd FileType html nnoremap <buffer> k gk
  autocmd FileType html nnoremap <buffer> <Down> gj
  autocmd FileType html nnoremap <buffer> <Up> gk

  " Auto-Expand tags on Enter
  autocmd FileType html inoremap <buffer> <expr> <CR> search('>\%\#<', 'n') ? "\<CR>\<C-o>O" : "\<CR>"
augroup END

" ==========================================
" 5. TRANSPARENCY
" ==========================================
highlight Normal       ctermbg=NONE guibg=NONE
highlight NonText      ctermbg=NONE guibg=NONE
highlight LineNr       ctermbg=NONE guibg=NONE
highlight SignColumn   ctermbg=NONE guibg=NONE
highlight EndOfBuffer  ctermbg=NONE guibg=NONE
