String datestamp() 
{
    Calendar now = Calendar.getInstance();
    return String.format("%1$ty-%1$tm-%1$td", now);
}

String timestamp() 
{
    Calendar now = Calendar.getInstance();
    return String.format("%1$tH"+":"+"%1$tM"+":"+"%1$tS", now);
}
String shortTimestamp() 
{
    Calendar now = Calendar.getInstance();
    return String.format("%1$tH"+"%1$tM", now);
}