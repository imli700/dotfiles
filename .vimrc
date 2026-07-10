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
" 4. SEARCH, SUBSTITUTE & MATCH INDICATOR (LazyVim-style)      -- ADDED
" ==========================================
" Highlight every match of the last search pattern, all the time.
set hlsearch
" Update that highlighting live, as you type -- for / and ? searches, AND
" for the {pattern} half of :substitute, :global, :sort, :vimgrep, etc.
" (Vim's own docs confirm 'incsearch' applies to :substitute, not just / ?)
set incsearch

" Distinguish the match your cursor is actually sitting on from every other
" match. This is a native Vim 9+ highlight group (:h hl-CurSearch); defining
" it explicitly means it looks right even if the colorscheme doesn't set it.
highlight CurSearch cterm=reverse ctermfg=214 gui=reverse guifg=#fe8019 guibg=#3c3836

" Note: the two 'set' lines above give live highlighting of the SEARCH
" PATTERN as you type it, for /, ?, and :s alike (confirmed against Vim's
" own docs). A full live PREVIEW of the *replacement* text, the way
" Neovim's 'inccommand' does it, is a Neovim-only option with no
" actively-maintained vanilla-Vim plugin equivalent as of this writing, so
" it isn't included here -- see chat for the full explanation.

" "Which match am I on" indicator, with no compromises:
"
" 1) The native one-line message Vim can show while searching, e.g. "[1/4]"
"    like your screenshot. It exists since Vim 8.1.1270, but ships OFF by
"    default (Vim's default 'shortmess' includes 'S', which suppresses it).
if has('patch-8.1.1270')
  set shortmess-=S
endif

" 2) The same count, but living permanently in the statusline instead of a
"    message that could get overwritten by something else -- and kept live
"    as you move between matches with n / N / * / #, not just right after
"    you search. This is Vim's own documented pattern for this (see
"    :h searchcount()), wired to a debounced CursorMoved autocommand, also
"    straight out of Vim's own docs.
if has('patch-8.1.1270')
  function! MyVimrcSearchCount() abort
    let l:r = searchcount(#{recompute: 0, maxcount: 0})
    if empty(l:r) || (l:r.current == 0 && l:r.total == 0)
      return ''
    endif
    if l:r.incomplete ==# 1
      return '[?/??]'
    endif
    return printf('[%d/%d]', l:r.current, l:r.total)
  endfunction

  set laststatus=2
  let &statusline = ' %f %m%r%h%w%=%{MyVimrcSearchCount()} %-10.(%l,%c%V%) %P '

  let s:searchcount_timer = -1
  function! s:ScheduleSearchCountRedraw() abort
    if s:searchcount_timer != -1
      call timer_stop(s:searchcount_timer)
    endif
    let s:searchcount_timer = timer_start(50, {-> execute('redrawstatus')})
  endfunction

  augroup vimrcLiveSearchCount
    autocmd!
    autocmd CursorMoved * call s:ScheduleSearchCountRedraw()
  augroup END
endif

" Esc in Normal mode also clears search highlighting (LazyVim does this
" too), so matches don't stay lit up forever once you're done with them.
nnoremap <silent> <Esc> :nohlsearch<CR>

" ==========================================
" 5. HTML SPECIFIC SETTINGS
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

" ADDED: Don't let vim-closetag double up a closing tag that's already
" there. Typing a fresh <div> right where a </div> immediately already
" follows used to leave you with </div></div>; this collapses it back to
" one. It only steps in when the closer sits with ZERO characters in
" between (i.e. exactly where closetag would have just auto-inserted a
" duplicate), so genuine same-name nesting like <div><div>text</div></div>
" -- where real content or a newline separates the tags -- is left
" completely alone. The one edge case this can't distinguish from that is
" typing a brand new same-named tag with LITERALLY nothing between it and
" an existing closer; that's rare enough in practice to be a reasonable
" trade for never seeing a stray duplicate closing tag again.
function! s:CleanupDuplicateCloseTag() abort
  let l:line = getline('.')
  let l:c = col('.') - 1
  let l:before = l:line[: l:c - 1]
  let l:tag = matchstr(l:before, '<\zs[a-zA-Z][a-zA-Z0-9:_-]*\ze\%(\s[^<>]*\)\?>$')
  if empty(l:tag)
    return
  endif
  let l:closer = '</' . l:tag . '>'
  let l:after = l:line[l:c :]
  if l:after[: len(l:closer) - 1] ==# l:closer && l:after[len(l:closer) : len(l:closer) * 2 - 1] ==# l:closer
    call setline('.', l:before . l:after[len(l:closer) :])
  endif
endfunction

augroup htmlSmartCloseTag
  autocmd!
  autocmd FileType html,xhtml,phtml autocmd TextChangedI <buffer> call s:CleanupDuplicateCloseTag()
augroup END

" ==========================================
" 6. TRANSPARENCY
" ==========================================
highlight Normal       ctermbg=NONE guibg=NONE
highlight NonText      ctermbg=NONE guibg=NONE
highlight LineNr       ctermbg=NONE guibg=NONE
highlight SignColumn   ctermbg=NONE guibg=NONE
highlight EndOfBuffer  ctermbg=NONE guibg=NONE
