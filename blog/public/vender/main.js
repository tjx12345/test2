require(['/public/vender/jquery/dist/jquery.js','/public/vender/bootstrap/dist/js/bootstrap.js','/public/js/bootstrap-paginator.js'],function($,_){
  var options = {
      currentPage:{{pager.currentPage}} ,
      totalPages :{{pager.totalPage}},
      pageUrl: function(type, page, current){
          return '{{pager.url}}?current='+page;//模糊查询分页点击后变普通查询因为这个url
      }
  };

  $('#temp_pager').bootstrapPaginator(options);
});
