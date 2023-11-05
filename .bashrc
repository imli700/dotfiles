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

# to make zathura read shit
export XDG_CONFIG_HOME="$HOME/.config"
