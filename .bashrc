# .bashrc

# Source global definitions
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

# User specific aliases and functions
if [ -d ~/.bashrc.d ]; then
  for rc in ~/.bashrc.d/*; do
    if [ -f "$rc" ]; then
      . "$rc"
    fi
  done
fi
unset rc

# Path
export PATH="$HOME/.local/bin:$PATH"

# For bare git repo
alias config='/usr/bin/git --git-dir=$HOME/dotfiles/ --work-tree=$HOME'

# to make nvim the default editor
export VISUAL=nvim
export EDITOR="$VISUAL"

# Colors
force_color_prompt=yes

if [ -x /usr/bin/dircolors ]; then
  eval "$(dircolors -b)"
  alias ls='ls --color=auto' # Linux
  # alias ls='ls -G'             # macOS
  alias grep='grep --color=auto'
  alias fgrep='fgrep --color=auto'
  alias egrep='egrep --color=auto'
fi

if [ -n "$force_color_prompt" ]; then
  if tput setaf 1 &>/dev/null; then
    color_prompt=yes
  fi
fi

if [ "$color_prompt" = yes ]; then
  PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
  PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi

# Set default browser
export BROWSER="qutebrowser"
export BROWSER_PATH="$(which qutebrowser)"

# For arch repo refreshment
alias refreshmirrors='sudo reflector --age 6 --latest 15 --protocol https --sort rate --save /etc/pacman.d/mirrorlist && sudo pacman -Syy'

# Function to set terminal title
set_term_title() {
  printf "\033]0;%s\007" "$1"
}

# Use a DEBUG trap to set the title to the command before it runs.
# This is the most reliable way in bash.
trap 'set_term_title "$BASH_COMMAND"' DEBUG

# Use PROMPT_COMMAND to reset the title after a command has finished.
PROMPT_COMMAND='set_term_title "bash"'
# to make zathura read shit
export XDG_CONFIG_HOME="$HOME/.config"

# fnm
FNM_PATH="/home/imli700/.local/share/fnm"
if [ -d "$FNM_PATH" ]; then
  export PATH="$FNM_PATH:$PATH"
  eval "$(fnm env)"
fi
. "$HOME/.cargo/env"
