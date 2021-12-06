# Gaïa-Inclusion
*Production at https://gaia-inclusion.fr/*

TODO
- List dirs
- list licenses
- Amnyos rights for text/logo/API-GAIA EPCX docx, logo/favicon remade based on from amnyos
- gaia-front/src/assets/partners-logos/Logo_Nouvelle-Aquitaine_2019.svg etc
- gaia-front/src/components/reusables/GaiaLogo.vue
- see TODO : JSON TEXTS GAIA       // TODO : Use with texts as external
- unsplash in all assets, some modified
- c4visio

## Env
### Frontend
- `VUE_APP_BACKEND_ADDRESS` (with or without trailing slash)
- `NODE_ENV=production` if forgotten, source map is included, even for pre-prod...
- `NGINX_ROOT=dist`
### Backend
- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS` (hostname or hostnames separated by spaces)
- `FRONTEND_ADDRESS` (with or without trailing slash)
#### Mail
- `EMAIL_HOST=mailing.gaia-inclusion.fr`
- `EMAIL_HOST_USER=no-reply@gaia-inclusion.fr`
- `EMAIL_HOST_PASSWORD`
- `EMAIL_PORT=587`
- `EMAIL_USE_TLS=1`
#### PDF Service
Used to connect to a [PyRestPdf](https://github.com/c4ffein/py-rest-pdf) instance, used to generate RDV administrative certificates
- `PDF_SERVICE_ADDRESS`
- `PDF_SERVICE_READ_TOKEN`
- `PDF_SERVICE_TEMPLATE_ID`

### tips
#### Local DEBUG env
```# venv/lib/python3.7/site-packages/_set_envs.pth
import os; os.environ["DEBUG"] = "TRUE"
```
- `export VUE_APP_DEBUG_KIOSK_TOKEN=xxx; npm run serve`

### Front
- `NODE_ENV=production` should already be handled by https://github.com/heroku/heroku-buildpack-nodejs, check


### gaia-blog
Ghost.js theme for the news module of the Gaia project.
Based on [Liebling](https://github.com/eddiesigner/liebling) but modified by [Clement Debatisse](https://github.com/clementdebatisse) to follow the Gaia graphic charter. Includes files from [c4ffein](https://github.com/c4ffein).  
See additional info and licenses in [the blog's README.md](https://github.com/c4ffein/gaia/blob/main/gaia-blog/README.md)
