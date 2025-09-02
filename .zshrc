# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

source /usr/share/cachyos-zsh-config/cachyos-config.zsh >/dev/null 2>&1

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# --- Additions from .bashrc ---

# Enable vim mode
bindkey -v

# Source global definitions if they exist
if [ -f /etc/bashrc ]; then
  . /etc/bashrc
fi

# User specific environment
if ! [[ "$PATH" =~ "$HOME/.local/bin:$HOME/bin:" ]]; then
  PATH="$HOME/.local/bin:$HOME/bin:$PATH"
fi
export PATH

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# Source user-specific aliases and functions
if [ -d ~/.bashrc.d ]; then
  for rc in ~/.bashrc.d/*; do
    if [ -f "$rc" ]; then
      . "$rc"
    fi
  done
fi
unset rc

# For bare git repo
alias config='/usr/bin/git --git-dir=$HOME/dotfiles/ --work-tree=$HOME'

# to make nvim the default editor
export VISUAL=nvim
export EDITOR="$VISUAL"

# Colors for commands
# Note: Zsh often handles colors automatically, but these aliases are good for consistency.
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Set default browser
export BROWSER="qutebrowser"
# The following line is generally not needed as long as qutebrowser is in your PATH.
# You can uncomment it if you have a specific reason to define the path.
# export BROWSER_PATH="$(which qutebrowser)"

# For arch repo refreshment
alias refreshmirrors='sudo reflector --verbose --sort age --download-timeout 60 -n 20 --save /etc/pacman.d/mirrorlist && sudo eos-rankmirrors'

# safer set_term_title using printf (avoids prompt-expansion issues)
set_term_title() {
  # \033 is ESC, \007 is BEL — many terminals accept this OSC sequence
  printf '\033]0;%s\007' "${1:-}"
}

# Keep simple precmd/preexec that call the above
precmd()  { set_term_title "zsh" }
preexec() { set_term_title "$1" }


# to make zathura read config
export XDG_CONFIG_HOME="$HOME/.config"

# Rust cargo environment
. "$HOME/.cargo/env"

# --- End of additions from .bashrc ---
eval "$(fnm env --use-on-cd)"
