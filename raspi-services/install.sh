#!/usr/bin/env bash

CONFIG_FILE="$HOME/.config/tardis-demo/participant.cfg"
BABEL_SERVICE_PATH="$HOME/.config/systemd/user/tardis-demo-babel.service"
GPIO_SERVICE_PATH="$HOME/.config/systemd/user/tardis-demo-gpio.service"
TARDIS_DEMO_SLICE_PATH="$HOME/.config/systemd/user/tardis-demo.slice"

MVN_CLEAN_PACKAGE=false

while getopts 'u' OPTION; do
    case "$OPTION" in
        u) MVN_CLEAN_PACKAGE=true;;
        ?) echo "Usage: $(basename $0) [-u] "; exit 1;;
    esac
done

scriptdir="$(dirname "$0")"
cd "$scriptdir"

# to hold participant config
declare -A config

# parse config file with participant parameters for this pi
parse_config() {
    while IFS='=' read -r key value; do
	[[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
        config["$key"]="$value"
    done < "$CONFIG_FILE"
}

# load config params for this pi
parse_config

# build param string
babel_params=""
for x in "${!config[@]}"; do 
    babel_params+=" $x=${config[$x]}"
done

babel_params="$(echo -e "$babel_params" | sed -e 's/^[[:space:]]*//')"
py_gpio_params="--type ${config["role"]}"

cat tardis-demo-babel.service.template | sed "s/<PARTICIPANT-PARAMS>/$babel_params/g" > tardis-demo-babel.service
cat tardis-demo-gpio.service.template | sed "s/<PARAMS>/$py_gpio_params/g" > tardis-demo-gpio.service

mv tardis-demo-babel.service $BABEL_SERVICE_PATH
mv tardis-demo-gpio.service $GPIO_SERVICE_PATH
systemctl --user daemon-reload

if $MVN_CLEAN_PACKAGE; then
    cd ../TaRDIS-DCR-Runtime && mvn clean package -U && cd -
fi

systemctl --user enable --now tardis-demo-babel.service
systemctl --user enable --now tardis-demo-gpio.service

echo "Install completed."
