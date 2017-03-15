'use strict';

const util = require('util');
const pm2 = require('pm2');
const pmx = require('pmx');
const FluentSender = require('./fluent_logger/sender').FluentSender;
const conf = pmx.initModule();

const FLUENTD_OUTTAG = conf.FLUENTD_OUTTAG || 'pm2.fluentd.out';
const FLUENTD_ERRTAG = conf.FLUENTD_ERRTAG || 'pm2.fluentd.err';
const FLUENTD_HOST = conf.FLUENTD_HOST || 'localhost';
const FLUENTD_PORT = parseInt(conf.FLUENTD_PORT || 24224);
const FLUENTD_TIMEOUT = parseFloat(conf.FLUENTD_TIMEOUT || 3.0);
const FLUENTD_RECONNECT_INTERVAL = parseInt(conf.FLUENTD_RECONNECT_INTERVAL || 30000);

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

pm2.launchBus(function(err, bus){
    console.log(conf.module_conf);
    console.log('[PM2] Log streaming started');
    bus.on('log:out', function (packet){
        let data = {};
        if (typeof packet.data !== "object"){
            try{
                data = JSON.parse(packet.data);
            }catch(err){
                data = {
                    log: packet.data,
                    '@timestamp': new Date().toISOString(),
                    source: 'stdout'
                };
            }
        }else{
            data = packet.data;
        }
        fluend_sender.emit(FLUENTD_OUTTAG, data);
    });

    bus.on('log:err', function (packet){
        let data = {};
        if (typeof packet.data !== "object"){
            try{
                data = JSON.parse(packet.data);
            }catch(err){
                data = {
                    log: packet.data,
                    '@timestamp': new Date().toISOString(),
                    source: 'stderr'
                };
            }
        }else{
            data = packet.data;
        }
        fluend_sender.emit(FLUENTD_ERRTAG, data);
    });

    bus.on('*', function(event, _data){
        let data = {};
        if (event === 'process:event' && _data.event === 'online'){
            let msg = util.format('Process %s restarted %s',
                                _data.process.name,
                                _data.process.restart_time);
            data = {
                log: msg,
                '@timestamp': new Date().toISOString(),
                source: 'stdout'
            };
        }else if (typeof _data !== "object"){
            try{
                data = JSON.parse(_data);
            }catch(err){
                data = {
                    log: _data,
                    '@timestamp': new Date().toISOString(),
                    source: 'stdout'
                };
            }
        }else{
            data = _data;
        }
        fluend_sender.emit(FLUENTD_OUTTAG, data);
    });
});