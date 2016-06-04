/**
 * 
 */

function TurnMinutesToHourmins(in_mins)
{
    var f_tag = ".TurnMinutesToHourmins() ";
    
    var sRes = "0小时";
    var iMins = 0;
    
    // 计算过后的小时和分钟数
    var iCountHour = 0;
    var iCountMin = 0;
    try
    {
        if (!isNaN(in_mins))
        {
            // 是数字
            
            iMins = in_mins + 0;
            
            iCountHour = Math.floor(iMins / 60);
            
            iCountMin = iMins % 60;
            
            if (0 >= iCountHour)
            {
                // 小时数无效
                if (0 >= iCountMin)
                {
                    // 分钟数无效
                    sRes = "0小时";
                }
                else
                {
                    sRes = iCountMin + "分钟";
                }
            }
            else
            {
                if (0 >= iCountMin)
                {
                    // 分钟数无效
                    sRes = iCountHour + "小时";
                }
                else
                {
                    sRes = iCountHour + "小时" + iCountMin + "分钟";
                }
            }
        }
    }
    catch (e)
    {
        console.log(f_tag + " has error!");
        console.log(e);
        
        return "0小时";
    }
    
    return sRes;
}
