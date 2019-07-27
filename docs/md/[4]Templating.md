## Templating
[Vimlet meta templating engine](https://github.com/vimlet/vimlet-meta) is built in bundl. 

If *"parse"* option is set to true at input, meta will be applied to file content.

Meta is used to generate files from templates that allow the use of javascript.

**IE**

>* Template1:
>` Hello I'm a template <%template(template2.vmi)%>`
>
>* Template2:
> `I'm another template`
>
>* Result:
> `Hello I'm a template I'm another template`


>* Template:
>` Hello I'm a template 
> <%
> for(var i = 0; i < 5; i++){
> echo(i);}
> %>`
>
>* Result:
> `Hello I'm a template 01234`

If you need more information regarding meta go to its [github](https://github.com/vimlet/vimlet-meta)
