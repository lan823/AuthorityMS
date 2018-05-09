/**
 * Created by ecarx on 2017/8/23.
 */
import request from '../utils/request';

export function queryStatistics() {
  return request('http://api.xchanger.cn/admingid/user/statistics', {
    method: 'GET',

  });
}
