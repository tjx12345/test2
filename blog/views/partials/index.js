define(function(){
  require(['/public/js/bootstrap-paginator.js'],function($){
    var options = {
        currentPage:{{pager.currentPage}} ,
        totalPages :{{pager.totalPage}},
        pageUrl: function(type, page, current){
            return '{{pager.url}}?current='+page;//模糊查询分页点击后变普通查询因为这个url
        }
    };

    $('#temp_pager').bootstrapPaginator(options);
  })
});
