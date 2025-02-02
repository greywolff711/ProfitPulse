import { useTheme,Box, Typography,Button } from '@mui/material'
import { useState, useMemo } from 'react'
import { useGetKpisQuery } from '../../state/api'
import DashboardBox from '../../components/DashboardBox'
import FlexBetween from '../../components/FlexBetween'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Label } from 'recharts'
import regression,{DataPoint} from "regression"

const Predictions = () => {
    const {palette} = useTheme()
    const [isPredictions, setIsPredictions] = useState(false)
    const {data:kpiData} = useGetKpisQuery()
    const formattedData = useMemo(()=> {
        if(!kpiData) return [];

        const monthData = kpiData[0].monthlyData;

        const formatted: Array<DataPoint> = monthData.map(({revenue}, i:number)=> {
            return [i, revenue]
        })
        const regressionLine = regression.linear(formatted)
        return monthData.map(({month, revenue}, i:number)=>{
            return {
                name:month,
                "Actual Revenue": revenue,
                "Regression Line": regressionLine.points[i][1],
                "Predicted Revenue": regressionLine.predict(i+12)[1]
            }
        })
    },[kpiData])

    return <DashboardBox width="100%" height="100%" p="1rem" overflow="hidden">
        <FlexBetween m="1rem 2.5rem" gap="1rem">
            <Box>
                <Typography variant='h3'>
                    Revenue and Predictions
                </Typography>
                <Typography variant='h6'>
                    Predictions made using regression model
                </Typography>
            </Box>
            <Button onClick={()=> setIsPredictions(!isPredictions)}
                sx={{
                    color:palette.grey[900],
                    bgcolor: palette.grey[700],
                    boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(0,0,0,0.4)"
                }}
            >
                Show Predictions
            </Button>
        </FlexBetween>

        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={formattedData}
            margin={{
                top: 20,
                right: 75,
                left: 20,
                bottom: 80,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={palette.grey[800]}/>
            <XAxis dataKey="name" tickLine={false} style={{fontSize: "10px"}}>
                <Label value="Month" offset={-5} position="insideBottom"/>
            </XAxis>
            <YAxis domain={[12000,26000]} axisLine={{strokeWidth: "0"}} tickLine={false} style={{fontSize: "10px"}}>
                <Label value="Revenue" offset={-5} angle={-90} position="insideLeft"/>
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top"/>
            <Line
                type="monotone"
                dataKey="Actual Revenue"
                stroke={palette.primary.main}
                strokeWidth={0}
                dot={{strokeWidth: 5}}
            />
            
            <Line
                type="monotone"
                dataKey="Regression Line"
                stroke="#8884d8"
                dot={false}
            />
            {
                isPredictions && (
                    <Line
                        strokeDasharray="5 5"
                        type="monotone"
                        dataKey="Predicted Revenue"
                        stroke={palette.secondary[500]}
                    />
                )
            }
            </LineChart>
        </ResponsiveContainer>
    </DashboardBox>
}

export default Predictions