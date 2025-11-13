#!/usr/bin/env bash

scriptdir="$(dirname "$0")"
cd "$scriptdir"

systemctl --user stop tardis-demo-gpio.service
systemctl --user disable tardis-demo-gpio.service
systemctl --user stop tardis-demo-babel.service
systemctl --user disable --now tardis-demo-babel.service
rm ~/.config/systemd/user/tardis-demo-babel.service
rm ~/.config/systemd/user/tardis-demo-gpio.service
rm -rf ../tardis-dcr-button-pi/src/__pycache__
