'use strict';

const util = require('util');
const pm2 = require('pm2');
const pmx = require('pmx');
const FluentSender = require('./fluent_logger/sender').FluentSender;
const conf = pmx.initModule();

const FLUENTD_TAG = conf.FLUENTD_TAG || 'pm2-fluentd';
const FLUENTD_HOST = conf.FLUENTD_HOST || 'localhost';
const FLUENTD_PORT = parseInt(conf.FLUENTD_PORT || '24224');
const FLUENTD_TIMEOUT = parseFloat(conf.FLUENTD_TIMEOUT || '3.0');
const FLUENTD_RECONNECT_INTERVAL = parseInt(conf.FLUENTD_RECONNECT_INTERVAL || 6000);

const fluend_sender = get_fluend_sender(null, {
    host: FLUENTD_HOST, 
    port: FLUENTD_PORT, 
    timeout: FLUENTD_TIMEOUT,
    reconnectInterval: FLUENTD_RECONNECT_INTERVAL
});

function get_fluend_sender(tag, options){
    let _sender = new FluentSender(tag, options);
    _sender._setupErrorHandler();
    return _sender;
}

pm2.launchBus(function(err, bus) {
    console.log('[PM2] Log streaming started');
    bus.on('log:out', function (packet) {
        let data = {};
        if (typeof packet.data !== "object") {
            try{
                data = JSON.parse(packet.data);
            }catch(err){
                data = {
                    log: packet.data,
                    '@timestamp': new Date().toISOString(),
                    source: 'stdout'
                };
            }
        }
        fluend_sender.emit(FLUENTD_TAG, data);
    });

    bus.on('log:err', function (packet) {
        let data = {
            log: packet.data,
            '@timestamp': new Date().toISOString(),
            source: 'stderr'
        };
        fluend_sender.emit(FLUENTD_TAG, data);
    });

    bus.on('*', function(event, _data){
        if (event === 'process:event' && _data.event === 'online') {
            let msg = util.format('Process %s restarted %s',
                                  _data.process.name,
                                  _data.process.restart_time);
            let data = {
                log: msg,
                '@timestamp': new Date().toISOString(),
                source: 'stdout'
            };
            fluend_sender.emit(FLUENTD_TAG, data);
        }
    });
});