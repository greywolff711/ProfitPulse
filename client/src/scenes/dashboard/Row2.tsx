import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import BoxHeader from '../../components/BoxHeader'
import DashboardBox from '../../components/DashboardBox'
import { useGetKpisQuery, useGetProductsQuery } from '../../state/api'
import { useTheme,Box,Typography } from '@mui/material'
import { useMemo } from 'react'
import FlexBetween from '../../components/FlexBetween'

const Row2 = () => {
  const {palette} =useTheme()
  const {data:operationalData} = useGetKpisQuery()
  const {data:productData} = useGetProductsQuery()

  const opeartionalExpenses = useMemo(()=>{
    return(
      operationalData  &&
      operationalData[0].monthlyData.map(({month, operationalExpenses, nonOperationalExpenses})=>{
        return {
          name: month.substring(0,3),
          "Operational Expenses": operationalExpenses,
          "Non Operational Expenses": nonOperationalExpenses,
        }
      })
    );
  },[operationalData])

  const productExpenseData = useMemo(()=>{
    return(
      productData  &&
      productData.map(({_id, price, expense})=>{
        return {
          id: _id,
          price:price,
          expense:expense,
        }
      })
    );
  },[productData])
  
  const pieColors = [palette.primary[800], palette.primary[300]]
  const pieData = [
    {name: "Group A", value: 600},
    {name: "Group A", value: 800},
  ]
  return (
    <>
        <DashboardBox gridArea="d">
          <BoxHeader title="Profit and Revenue" sideText="+2%"/>
          <ResponsiveContainer width="100%" height="100%">
              <LineChart
              width={500}
              height={400}
              data={opeartionalExpenses}
              margin={{
                  top: 20,
                  right: 0,
                  left: -10,
                  bottom: 55,
              }}
              >
              <CartesianGrid vertical={false} stroke={palette.grey[800]}/>
              <XAxis dataKey="name" tickLine={false} style={{fontSize: "10px"}}/>
              <YAxis yAxisId="left" orientation='left' axisLine={false} tickLine={false} style={{fontSize: "10px"}}/>
              <YAxis yAxisId="right" orientation='right' axisLine={false} tickLine={false} style={{fontSize: "10px"}}/>
              <Tooltip />
              <Line 
                  yAxisId="left"
                  type="monotone"
                  dataKey="Non Operational Expenses"
                  stroke={palette.tertiary[500]}
              />
              
              <Line 
                  yAxisId="right"
                  type="monotone"
                  dataKey="Operational Expenses"
                  stroke={palette.primary.main}
              />
              </LineChart>
          </ResponsiveContainer>
        </DashboardBox>
        <DashboardBox gridArea="e">
          <BoxHeader title="Goals" sideText='Not Achieved'/>
          <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
            <PieChart width={110} height={100}
              margin={{
                  top: 0,
                  right: -10,
                  left: 10,
                  bottom: 0,
              }}>
              <Pie
                stroke='none'
                data={pieData}
                innerRadius={18}
                outerRadius={38}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
            </PieChart>
            <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
              <Typography variant='h5'>Target</Typography>
              <Typography variant='h3' color={palette.primary[300]}>90</Typography>
              <Typography variant='h6'>Final Goals</Typography>
            </Box>
            <Box ml="-0.7rem" flexBasis="40%">
              <Typography variant='h5'>Loss</Typography>
              <Typography variant='h6'>Loss is up 10%</Typography>
              <Typography variant='h5'>Profit Margin</Typography>
              <Typography variant='h5'>Margins are down by 20%</Typography>
            </Box>
          </FlexBetween>
          
        </DashboardBox>
        <DashboardBox gridArea="f">
          <BoxHeader title="Product prices vs expenses" sideText='+15%'/>
          <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 40,
              left: -10,
            }}
          >
            <CartesianGrid  stroke={palette.grey[800]}/>
            <XAxis 
              type="number" 
              dataKey="price" 
              name="price" 
              axisLine={false}
              tickLine={false}
              style={{fontSize:"10px"}}
              tickFormatter={(v)=>`¥${v}`}
            />
            <YAxis 
              type="number" 
              dataKey="expense" 
              name="expense" 
              axisLine={false}
              tickLine={false}
              style={{fontSize:"10px"}}
              tickFormatter={(v)=>`¥${v}`}
            />
            <ZAxis type='number' range={[20]}/>
            <Tooltip formatter={(v)=>`¥${v}`}/>
            <Scatter name="Expense ratio" data={productExpenseData} fill={palette.tertiary[500]}/>
          </ScatterChart>
        </ResponsiveContainer>
        </DashboardBox>
    </>
  )
}

export default Row2