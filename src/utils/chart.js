import * as echarts from 'echarts';

export default {
    // 执行信息图表（横向矩状图）
    chart1(ele, data, dataLabel) {
        /*
        ele:显示图表的元素
        data:包含数据的数组 [100，80，13，7]
        dataLabel:包含数据的名称的数组 ['总数','通过','失败','错误']
        */
        //1.初始化chart01
        const chart1 = echarts.init(ele);
        let barLengths = []
        data.forEach((item) => {
            barLengths.push(data[0])
        })
        //2.配置数据
        const myColor = ['#57625c', '#1c762f', '#7d5e03',
            '#701a23', '#1f4d7c', '#267065'];
        const option = {
            //图标位置
            grid: {
                top: '3%',
                left: '20%',
                bottom: '3%'
            },

            xAxis: {
                show: false
            },
            yAxis: [{
                show: true,
                data: dataLabel,
                inverse: true,
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#c5c5c5',
                    fontWeight: 'bold'
                }
            },
                {
                    show: false,
                    inverse: true,
                    data: data,
                    axisLabel: {
                        fontSize: 12,
                        color: '#c5c5c5',
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                }
            ],
            series: [{
                type: 'bar',
                yAxisIndex: 0,
                data: data,
                barCategoryGap: 50,
                barWidth: 10,
                showBackground: true,
                itemStyle: {
                    borderRadius: 6,
                    color: function (params) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num];
                    }

                }
            },
                {
                    type: 'bar',
                    yAxisIndex: 1,
                    barCategoryGap: 50,
                    data: barLengths,
                    barWidth: 14,
                    itemStyle: {
                        color: 'none',
                        borderColor: '#8b8b8b',
                        borderWidth: 2,
                        borderRadius: 6

                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}条',
                        color: '#c5c5c5',

                    }
                }
            ]
        };
        // 渲染图表。
        chart1.setOption(option);
        return chart1
    },
    // 用例通过率图表（饼图）
    chart2(ele, datas) {
        /*
        ele：展示图表的元素
        datas: 通过率数据：格式如下
            [{
                value: 80,
                name: '通过'
            }, {
                value: 30,
                name: '失败'
            }, {
                value: 1,
                name: '错误'
            }]
        */
        //1.初始化chart2
        const chart2 = echarts.init(ele);
        //2 图表样式配置
        const option = {
            color: ['#11481d', '#644b02', '#6d0000', '#1e4c7a', '#297a6e'],
            tooltip: {
                trigger: 'item',
                formatter: '{d}%【{c}条】',
                backgroundColor: 'rgba(43, 43, 43, 0.6)',
                borderColor: '#00aaff',
                textStyle: {
                    color: '#00aaff',
                    fontSize: '16',
                    fontWeight: 'bold'
                }
            },
            legend: {
                orient: 'vertical',
                right: 10,
                bottom: 10,
                textStyle: {
                    color: '#c5c5c5',
                    fontWeight: 'bold'
                }

            },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold',
                        color: '#c5c5c5',
                    }
                },
                labelLine: {
                    show: false,
                    color: '#55aaff'
                },
                data: datas
            }]
        };
        //3、渲染图表。
        chart2.setOption(option);
        return chart2
    },
    // 折线图（通过率趋势图）
    chart3(ele, value, label) {
        /*
        ele：元素
        value:通过率数组[78,80,60,90]
        labal：x轴刻度 ['2012-12-5','2012-12-8','2012-12-8','2012-12-12','2012-12-13']
        */
        //1.初始化chart01
        const chart3 = echarts.init(ele);
        //2.配置数据
        let option = {
            title: {
                text: "通过率(%)",
                textStyle: {
                    fontSize: 14,
                    color: '#c5c5c5',
                }
            },
            grid: {
                top: 50,
                bottom: 10,
                left: 20,
                right: 20,
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} :<br/> 通过率 ： {c}%',
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(255,255,255,0)' // 0% 处的颜色
                            },
                                {
                                    offset: 0.5,
                                    color: 'rgba(255,255,255,1)' // 100% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(255,255,255,0)' // 100% 处的颜色
                                }
                            ],
                            global: false // 缺省为 false
                        }
                    }
                }
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                show: true,
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#00557f'
                    }
                },
                axisTick: {
                    show: false
                },
                data: label
            }],
            yAxis: [{
                show: true,
                boundaryGap: false,
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#c5c5c5',
                    }
                },
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 12,
                    lineHeight: 40
                },
                splitLine: {
                    lineStyle: {
                        color: '#3c3e3d'
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#00557f'
                    }
                },
                axisTick: {
                    show: true
                }
            }],
            series: [{
                name: '通过率',
                type: 'line',
                smooth: true,
                showSymbol: true,
                symbolSize: 8,
                zlevel: 3,
                itemStyle: {
                    color: '#19a3df',
                    borderColor: '#313131'
                },
                lineStyle: {
                    width: 1,
                    color: '#00557f'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [{
                            offset: 0,
                            color: 'rgba(0, 133, 199, 0.8)'
                        },
                            {
                                offset: 0.5,
                                color: 'rgba(34, 73, 111, 0.4)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(8, 10, 11, 0.1)'
                            }
                        ],
                        false
                    )
                },
                data: value
            }]
        };
        //3.传入数据
        chart3.setOption(option);
        return chart3
    },

    // 散点图
    chart4(ele, datas) {
        if (!ele || !datas || datas.length === 0) {
            console.warn('Invalid element or data for chart4');
            return;
        }

        const indices = {
            id: 0,
            env: 1,
            task: 2,
            create_time: 3,
            all: 4,
            success: 5,
            fail: 6,
            error: 7,
            pass_rate: 8,
            tester: 9,
            status: 10
        };

        const schema = [
            {name: 'id', index: 0},
            {name: 'env', index: 1},
            {name: 'task', index: 2},
            {name: 'create_time', index: 3},
            {name: 'all', index: 4},
            {name: 'success', index: 5},
            {name: 'fail', index: 6},
            {name: 'error', index: 7},
            {name: 'pass_rate', index: 8},
            {name: 'tester', index: 9},
            {name: 'status', index: 10}
        ];

        const fieldIndices = schema.reduce(function (obj, item) {
            obj[item.name] = item.index;
            return obj;
        }, {});

        // 用于存储不同类别的颜色映射
        const categoryColors = {};
        let myChart = null;
        let data;
        let currentXAxis = 'create_time';
        let currentSymbolSize = 10; // 默认点大小

        // 模拟数据
        const originData = datas;

        function normalizeData(originData) {
            // 收集所有唯一类别以分配颜色
            const categories = new Set();
            originData.forEach(function (row) {
                if (row.env) categories.add(row.env);
                if (row.task) categories.add(row.task);
            });

            // 为每个唯一类别分配颜色
            let categoryArray = Array.from(categories);
            let hStep = Math.round(300 / (categoryArray.length - 1 || 1));
            categoryArray.forEach((category, i) => {
                categoryColors[category] = echarts.color.modifyHSL('#5A94DF', hStep * i);
            });

            // 转换数据格式
            let processedData = originData.map(function (row) {
                let processedRow = new Array(schema.length);
                for (let i = 0; i < schema.length; i++) {
                    processedRow[i] = row[schema[i].name];
                }
                return processedRow;
            });

            processedData.forEach(function (row) {
                for (let index = 0; index < row.length; index++) {
                    if (
                        index !== indices.env &&
                        index !== indices.task &&
                        index !== indices.create_time
                    ) {
                        if (index === indices.pass_rate) {
                            row[index] = parseFloat(row[index]) || 0;
                        } else if (index !== indices.id && index !== indices.tester && index !== indices.status) {
                            row[index] = parseFloat(row[index]) || 0;
                        }
                    }
                }
            });

            return processedData;
        }

        function getOption(data, xAxisField = 'create_time') {
            // 为category类型x轴准备数据
            let uniqueXValues = [...new Set(data.map(item => item[fieldIndices[xAxisField]]))];

            // 如果是时间字段，按时间排序，确保最新的在右边
            if (xAxisField === 'create_time') {
                uniqueXValues.sort((a, b) => new Date(a) - new Date(b));
            }

            return {
                xAxis: {
                    type: 'category',
                    name: xAxisField,
                    data: uniqueXValues,
                    splitLine: {show: false}
                },
                yAxis: {
                    type: 'value',
                    name: '通过率(%)',
                    splitLine: {show: false},
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: [
                    {
                        zlevel: 1,
                        name: '测试结果',
                        type: 'scatter',
                        data: data.map(function (item, idx) {
                            // 根据当前X轴字段选择颜色分类依据
                            let category;
                            if (xAxisField === 'env') {
                                category = item[indices.task]; // X轴是环境时，按任务分类颜色
                            } else {
                                category = item[indices.task]; // 其他情况按任务分类颜色
                            }

                            return {
                                value: [item[fieldIndices[xAxisField]], item[indices.pass_rate], category, idx],
                                itemStyle: {
                                    color: categoryColors[category] || '#5A94DF'
                                }
                            };
                        }),
                        animationThreshold: 5000,
                        progressiveThreshold: 5000,
                        symbolSize: currentSymbolSize // 使用当前设置的点大小
                    }
                ],
                animationEasingUpdate: 'cubicInOut',
                animationDurationUpdate: 2000,
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        const dataIndex = params.data.value[3];
                        const rowData = data[dataIndex];
                        if (!rowData) return '';
                        return `${rowData[indices.task] || ''}<br/>
            ${xAxisField}: ${params.data.value[0]}<br/>
            环境: ${rowData[indices.env] || ''}<br/>
            通过率: ${rowData[indices.pass_rate] || 0}%`;
                    }
                },
                legend: {
                    show: true,
                    data: Object.keys(categoryColors),
                    textStyle: {
                        color: '#fff'
                    }
                }
            };
        }

        // X轴切换函数
        function changeXAxis(xAxisField) {
            if (data && myChart) {
                currentXAxis = xAxisField;
                const option = getOption(data, xAxisField);
                myChart.setOption(option, true); // true表示不合并选项，完全替换
            }
        }

        // 点大小调整函数
        function changeSymbolSize(size) {
            if (myChart) {
                currentSymbolSize = size;
                const option = getOption(data, currentXAxis);
                myChart.setOption(option, true);
            }
        }

        try {
            myChart = echarts.init(ele);

            // 初始化数据
            data = normalizeData(originData);
            const option = getOption(data, currentXAxis);

            myChart.setOption(option);

            window.addEventListener('resize', () => {
                if (myChart) {
                    myChart.resize();
                }
            });

            // 返回图表实例和控制函数，供外部调用
            return {
                chart: myChart,
                changeXAxis: changeXAxis,
                changeSymbolSize: changeSymbolSize, // 返回点大小调整函数
                dispose: () => {
                    if (myChart) {
                        myChart.dispose();
                    }
                }
            };
        } catch (error) {
            console.error('Error initializing chart:', error);
            return null;
        }
    }
}