import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function B2B() {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10" style={{borderTop:'0.5px solid #e2ddd0'}}>
      <Card className="border-0 shadow-none rounded-xl overflow-hidden">
        <CardContent className="flex items-center justify-between gap-4 p-6" style={{background:'#1C2D1C'}}>
          <div>
            <div className="text-sm font-medium mb-1" style={{color:'#F9F7EF',fontFamily:'Georgia,serif'}}>Владелец салона?</div>
            <div className="text-xs" style={{color:'rgba(249,247,239,.4)'}}>Заполните пустые окошки за 60 минут — без маркетинга и рисков</div>
          </div>
          <Button className="flex-shrink-0 text-white font-medium px-6" style={{background:'#F97316'}}>
            Подключить салон
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
