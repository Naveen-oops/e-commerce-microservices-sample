#!/bin/sh
# This script generates a runtime config with environment variables

# Default values
PRODUCTS_URL=${REACT_APP_PRODUCTS_URL_BASE:-/api/products/}
CART_URL=${REACT_APP_CART_URL_BASE:-/api/cart/}
USERS_URL=${REACT_APP_USERS_URL_BASE:-/api/users/}
SEARCH_URL=${REACT_APP_SEARCH_URL_BASE:-/api/search/}

# Create config file with the environment variables
cat <<EOF > /store-ui/config.js
window.ENV = {
  REACT_APP_PRODUCTS_URL_BASE: "${PRODUCTS_URL}",
  REACT_APP_CART_URL_BASE: "${CART_URL}",
  REACT_APP_USERS_URL_BASE: "${USERS_URL}",
  REACT_APP_SEARCH_URL_BASE: "${SEARCH_URL}"
};
EOF

# Execute the CMD
exec "$@"