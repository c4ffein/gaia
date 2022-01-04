# Gaïa-Inclusion
*Production at https://gaia-inclusion.fr/*

## Project directories (and licenses)

### gaia-front
Vue.js frontend, see `Env` for configuration. Recommended to deploy using [Dokku](https://dokku.com/) as all conf files are included.
#### licenses
- [Unsplash](https://unsplash.com/license) for assets in the [unsplash](/gaia-front/src/assets/unsplash) directory.
- - All texts in the [amnyos-assets.js](gaia-front/src/assets/amnyos-assets.js) file are the property of [Amnyos](https://www.amnyos.com/), and the Gaïa logo paths were computed from the rasterized logo provided by them to build this site.
  - The Gaïa logo was also used for the [favicon.ico](gaia-front/public/favicon.ico).
  - Files in the [communication](gaia-front/public/communication) folder were provided by them for temporary purposes but are still kept there to stay accessible.
  - All rights reserved.
- Every file in the [fonts](gaia-front/src/assets/fonts) directory is [SIL Open Font License (OFL)](https://scripts.sil.org/OFL) licensed.
- [Material icons](gaia-front/src/assets/material-person-18dp.svg) are [Apache](https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE) licensed.
- [Partners logos](gaia-front/src/assets/partners-logos) are the property of their respective owners, all rights reserved.
- Everything else is released as [AGPL](licenses/agpl-3.0.md), copyright c4ffein.
### gaia-back
Django backend, see `Env` for configuration. Recommended to deploy using [Dokku](https://dokku.com/) as all conf files are included.
#### licenses
- All rights reserved for the [csv files](gaia-back/templates/csvs) provided by [Amnyos](https://www.amnyos.com/).
- All rights reserved for the python strings in the [forms default_templates](gaia-back/form_templates/default_templates) as they were provided by [Amnyos](https://www.amnyos.com/) too.
- Everything else is released as [AGPL](licenses/agpl-3.0.md), copyright c4ffein.

### gaia-blog
Ghost.js theme for the news module of the Gaia project.
Based on [Liebling](https://github.com/eddiesigner/liebling) but modified by [Clement Debatisse](https://github.com/clementdebatisse) to follow the Gaia graphic charter. Includes files from [c4ffein](https://github.com/c4ffein).
#### licenses
See additional info and licenses in [the blog's README.md](https://github.com/c4ffein/gaia/blob/main/gaia-blog/README.md)


## Required remote services
*link them through env*
- A [Jitsi](https://github.com/jitsi/jitsi-meet) instance
- A [PyRestPdf](https://github.com/c4ffein/py-rest-pdf) instance
- A mail service


## Env

### Frontend
- `VUE_APP_BACKEND_ADDRESS` (with or without trailing slash)
- `NODE_ENV=production` if forgotten, source map is included, even for pre-prod, already handled by `heroku-buildpack-nodejs`
- `NGINX_ROOT=dist`
#### Debug
- `VUE_APP_DEBUG_KIOSK_TOKEN` to emulate Kiosk behavior

### Backend
- `SECRET_KEY` Django secret key
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
