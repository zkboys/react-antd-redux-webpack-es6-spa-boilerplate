import * as PubSubMsg from 'zk-react/utils/pubsubmsg';

export default function utilsMiddleware() {
    return next => action => {
        const {payload, error, meta = {}} = action;
        const {sequence = {}, autoTipSuccess, autoTipError = '未知系统错误'} = meta;
        // error handle
        if (autoTipError && error) {
            console.error(payload);
            PubSubMsg.publish('message', {type: 'error', message: autoTipError, error: payload});
        }
        if (sequence.type === 'next' && !error && autoTipSuccess) {
            PubSubMsg.publish('message', {type: 'success', message: autoTipSuccess});
        }
        next(action);
    };
}
