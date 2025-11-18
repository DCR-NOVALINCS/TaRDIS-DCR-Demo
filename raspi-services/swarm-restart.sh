#!/bin/bash
for hostname in "p-1-1" "p-2-1" "p-3-1" "co-1" "co-2" "p-1-2"; do
    timeout 2 ssh "pi-1@${hostname}.local" 'systemctl --user restart tardis-demo-babel.service && systemctl --user restart tardis-demo-gpio.service'
done
