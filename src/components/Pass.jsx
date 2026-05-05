import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function Pass() {
  return (
    <div className="px-6 md:px-16 lg:px-24 py-10" style={{borderTop:'0.5px solid #e2ddd0'}}>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{color:'#8F8475'}}>Единый абонемент</div>
      <div className="text-xl font-normal mb-5" style={{color:'#1C2D1C',fontFamily:'Georgia,serif'}}>Один абонемент — сотни салонов</div>
      <Card className="border shadow-none relative overflow-hidden" style={{borderColor:'#e2ddd0',background:'#fff'}}>
        <CardContent className="flex items-center gap-5 p-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{background:'rgba(28,45,28,.06)'}}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="2" y="6" width="18" height="10" rx="2" stroke="#1C2D1C" strokeWidth="1.2"/><path d="M6 6v10M16 6v10" stroke="#1C2D1C" strokeWidth="1" strokeDasharray="2 2"/></svg>
          </div>
          <Separator orientation="vertical" className="h-12"/>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1" style={{color:'#1C2D1C',fontFamily:'Georgia,serif'}}>5 сеансов по цене 3</div>
            <div className="text-xs mb-3" style={{color:'#8F8475',lineHeight:1.6}}>Используй в любом салоне сети Lovi · Без ограничений</div>
            <Button size="sm" style={{background:'#1C2D1C',color:'#F9F7EF'}}>Выбрать тариф</Button>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-xl font-medium" style={{color:'#1C2D1C',fontFamily:'Georgia,serif'}}>15 000 ₽</div>
            <div className="text-[10px]" style={{color:'#8F8475'}}>от 3 000 ₽ за сеанс</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
