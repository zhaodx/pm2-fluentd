# pm2-fluentd
PM2 Fluentd Plugin

## Install
```javascript
    pm2 install zhaodx/pm2-fluentd
```

## Configuration 
Replace below {{}} with your own variables.
```javascript
    pm2 conf pm2-fluentd:FLUENTD_HOST {{YOUR_FLUENT_HOST}} // Default 'localhost'
    pm2 conf pm2-fluentd:FLUENTD_PORT {{YOUR_FLUENT_PORT}} // Default 24224
    pm2 conf pm2-fluentd:FLUENTD_OUTTAG {{YOUR_FLUENT_OUTTAG}} // Default 'pm2.fluentd.out'
    pm2 conf pm2-fluentd:FLUENTD_ERRTAG {{YOUR_FLUENT_ERRTAG}} // Default 'pm2.fluentd.err'
    pm2 conf pm2-fluentd:FLUENTD_TIMEOUT {{YOUR_FLUENT_TIMEOUT}} //Default 3.0
    pm2 conf pm2-fluentd:FLUENTD_RECONNECT_INTERVAL {{YOUR_FLUENT_RECONNECT_INTERVAL}} //Default 30000
```

## Uninstall
```javascript
    pm2 uninstall pm2-fluentd
```