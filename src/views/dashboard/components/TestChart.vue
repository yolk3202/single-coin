
<script setup lang="ts">

// 引入 ECharts
var echarts = require('echarts');

// 初始化图表
var myChart = echarts.init(document.getElementById('yourChartContainer'));

// 模拟一些数据
var data = [];
for (var i = 0; i <= 100; i++) {
    data.push(i);
}

// 配置项
var option = {
    xAxis: {
        type: 'category',
        data: data,
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            type: 'line',
            data: data,
        },
    ],
    graphic: [
        {
            type: 'rect',
            z: 100,
            left: '10%',
            top: '10%',
            shape: {
                width: '80%',
                height: '80%',
            },
            draggable: true,  // 设置可拖拽
            cursor: 'move',   // 设置鼠标样式
            ondrag: function (params) {
                // 处理拖拽事件
                var rect = params.target.shape;
                var xAxis = myChart.getModel().getComponent('xAxis', 0);

                var xAxisWidth = xAxis.getExtent()[1] - xAxis.getExtent()[0];

                // 限制 y 轴方向上的拖拽
                rect.y = Math.min(Math.max(rect.y, 0), myChart.getHeight() - rect.height);

                var xMin = xAxis.scale.inverse(rect.x / myChart.getWidth() * xAxisWidth + xAxis.getExtent()[0]);
                var xMax = xAxis.scale.inverse((rect.x + rect.width) / myChart.getWidth() * xAxisWidth + xAxis.getExtent()[0]);

                // 在这里可以处理拖拽后的逻辑，例如更新折线图的显示范围
                myChart.setOption({
                    xAxis: {
                        min: xMin,
                        max: xMax,
                    },
                });
            },
        },
    ],
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);
</script>