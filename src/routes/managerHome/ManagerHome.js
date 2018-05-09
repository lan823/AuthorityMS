import React, { Component } from 'react';
import { conent } from 'dva';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import {  Menu, Icon, Breadcrumb, Row, Col, Card  } from 'antd';
import styles from './ManagerHome.less';
import * as homeStatisticsService from '../../services/homeStatisticsService'

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';


class ManagerHome extends Component{
	constructor(props) {
		super(props);
		this.state = {
      showChart: false,
			userNumOption: {},
			userAuthOption: {},
		}
	}
  _getData = ()=>{
    homeStatisticsService.queryStatistics().then((res)=>{
      if(res){
        console.log('res',res);
        this.setState({
          userNumOption: {
            color:['#0097E0','#FF9FAA',],
            title : {
              text: '用户数 | USERS',
              show: false         
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              bottom: '20',
              data: ['注册用户数','实名认证数'],
              selectedMode: false
            },
            series : [
              {
                name: '用户数',
                type: 'pie',
                radius : '55%',
                center: ['50%', '35%'],
                label: {
                    normal: {
                        position: 'inner',
                        formatter: '{d}%'
                    }
                },
                data:[
                  {value:res.data.register, name:'注册用户数'},
                  {value:res.data.realNameCertified, name:'实名认证数'},
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          },
          userAuthOption: {
            color:['#0097E0','#FF9FAA','#7ED321', '#6D7BFF','#F5A623',],
            title : {
              text: '用户属性 | ATTRIBUTE',
              show: false         
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              bottom: '20',
              data: ['男性','女性'],
              selectedMode: false
            },
            series : [
              {
                name: '用户属性',
                type: 'pie',
                radius : '55%',
                center: ['50%', '35%'],
                label: {
                    normal: {
                        position: 'inner',
                        formatter: '{d}%'
                    }
                },
                data:[
                  {value:res.data.boy, name:'男性'},
                  {value:res.data.girl, name:'女性'},
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          },
          showChart: true
        },()=>{
          let userNum = document.querySelector('#userNum');
          let userAuth = document.querySelector('#userAuth');
          this.showChart(this.state.userNumOption,userNum);
          this.showChart(this.state.userAuthOption,userAuth);
        })
      }
    })
  }
	componentDidMount(){
    this._getData();
	}
	showChart(option,el) {
		let userNum = echarts.init(el);
		userNum.setOption(option);
	}
	render(){
		return (
			<div className={styles.chartBox}>
        {this.state.showChart?
  				<Row gutter={8}>
            <Col className="gutter-row" lg={12} md={12}>
              <Card title={this.state.userNumOption.title.text}>
                <div className={styles.chart} id='userNum'></div>
              </Card>
            </Col>
            <Col className="gutter-row" lg={12} md={12}>
              <Card title={this.state.userAuthOption.title.text}>
                <div className={styles.chart} id='userAuth'></div>
              </Card>
            </Col>
          </Row>
          :'未获取到数据'
        }
			</div>
		)
	}
}

export default ManagerHome;