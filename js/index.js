
cloudDrive();
function cloudDrive(){
    var cloudHeader = $('.cloud-header');
    var promptSpan = $('.input-placeholder');
    var searchForm = $('.search-query');
    var asideList = $('#menu-list li');
    var createDirBtn = $('.newdir-btn');
    var switchBtn = $('.main-bar-right');
    var mainContent = $('.main-content');
    var contextmenus=$('#contextmenus');
    var aList=$('#contextmenus li');
    var moduleView = $('.module-views');
    var newFile = $('.new-file div');
    var dragBox = $('#dragbox');
    var modeDisplay = true;//控制是缩略图还是列表、默认是缩略图
    var checkAll = $('#checkAll');
    var newFileName = $('.new-file-name');
    var newFile = $('.new-file div');
    var newFileSure = $('.sure-btn');
    var newFileCancel = $('.cancel-btn');
    var filesData = [
        {
            id: 1,
            pid: 0,
            name: 'DriversBackup',
            type: '',
            classname: ['dir-large', 'dir-small']
        },
        {
            id: 2,
            pid: 1,
            name: '游戏大全',
            type: '',
            classname: ['dir-large', 'dir-small']
        },
        {
            id: 3,
            pid: 0,
            name: 'OneDrive',
            type: '',
            classname: ['dir-large', 'dir-small']
        },
        {
            id: 4,
            pid: 1,
            name: 'js宝典.txt',
            type: 'txt',
            classname: ['fileicon-txt', 'fileicon-small-txt']
        },
        {
            id: 5,
            pid: 0,
            name: 'JS入门.mp4',
            type: 'mp4',
            classname: ['fileicon-video', 'fileicon-small-video']
        },
        {
            id: 6,
            pid: 0,
            name: 'js事件.ppt',
            type: 'ppt',
            classname: ['fileicon-ppt', 'fileicon-small-ppt']
        },
        {
            id: 7,
            pid: 2,
            name: '滑板鞋.mp3',
            type: 'mp3',
            classname: ['fileicon-music', 'fileicon-small-music']
        }
    ];
    //生成文件列表
    var folderId = 0;   //当前文件夹的id
    var filesCount = filesData.length;
    var prevBtn = $('.file-oper-btn a:eq(0)');
    var deleBtn = $('.file-oper-btn a:eq(2)');
    var list = $('.module-views ul');
    var listTips = $('.list-tips');
    var fileEicon;//用于存放生成后获取的元素
    var countSel = $('.count-selected');
    var Child = countSel.children().eq(1);
    var fileNum = 0;//存放被选中的文件的数量
    renderList(getChildren(folderId));
    //创建文件夹
    createDirBtn.click(function () {
        newFileSure.off();
        newFileCancel.off();
        var filename = '新建文件夹';
        var j = {
            id: ++filesCount,
            pid: folderId,
            name: filename,
            type: '',
            classname: ['dir-large', 'dir-small']
        }
        filesData.unshift(j);//向数据文档开头添加一个元素
        renderList(getChildren(folderId));//再次生成文档列表
        newFile.css({
            'top': ($('.fileicon').offset().top + $('.fileicon').height()) + 'px'
        })
        newFile.show();
        //点击确定时
        newFileSure.click(function () {
            if (newFileName.val() == '') {
                filesData[0].name = '新建文件夹'
            } else {
                filesData[0].name = newFileName.val();
            }
            newFile.hide();
            renderList(getChildren(folderId));//再次生成文档列表
        });
        //点击取消时
        newFileCancel.click(function () {
            newFile.hide();
            filesData.splice(0, 1);//从filesData删除下标为0的所有数据
            renderList(getChildren(folderId));//再次生成文档列表
        });
    });
    //删除选中的文文档
    deleBtn.on("click", function () {
        checkAll.removeClass('checked');//取消全选状态
        var selIndex = [];//存放选中的文件的id
        var filespid = 0;//存放选择文件的pid
        if(confirm("确认要删除此项吗？")){
            fileEicon.each(function (i) {
                if ($(this).hasClass('item-active')) {
                    //存放当前点击文件的fileid到数组中
                    selIndex.push(parseInt($(this).parent().attr('fileid')));
                }
            })
            $.each(selIndex, function (i) {
                $.each(filesData, function (j) {
                    //如果filesData[j]存在并且其id等于选中的id
                    if (filesData[j] && filesData[j].id == selIndex[i]) {
                        filespid = filesData[j].pid;
                        filesData.splice(j, 1);
                    };
                });
            });
            renderList(getChildren(filespid));//读取数据
            Child.html(0);
        }
    });
    //文件全选功能
    checkAll.click(function () {
        $(this).toggleClass('checked');//切换class
        if ($(this).hasClass('checked')) {//如果全选
            fileEicon.addClass('item-active');//全选时给所有文档添加选中样式
            fileNum = fileEicon.filter('.item-active').size();
        } else {//移除所有文档的选中样式
            fileEicon.removeClass('item-active');
            fileNum = 0;
        }
        Child.html(fileNum);
    });

    //返回上一级
    prevBtn.on('click', function () {
        //得到当前所在文件夹的id
        var info = getInfo(folderId);
        folderId = info.pid;

        renderList(getChildren(folderId));
    })


    //根据id获取一个文件的信息
    function getInfo(id) {
        var datas;
        $.each(filesData, function (i) {
            if (filesData[i].id == id) {
                datas = filesData[i];
            }
        });
        return datas;
    };
    //右键菜单功能
    $(document).contextmenu(function () {
                return false;
            });
    $(document).click(function () {
        contextmenus.hide();
    });
    mainContent.contextmenu(function(ev){
        contextmenus.css({
            left:ev.clientX + 'px',
            top:ev.clientY + 'px'
        });
        contextmenus.show();
    });
    //切换列表形式
    aList.eq(1).click(function () {
        listSwitch();
    });
    //切换缩略图
    aList.eq(2).click(function(){
        gridSwitch();
    });

    //刷新
    aList.eq(3).click(function(){
        window.location.href=window.location.href;
    });
    //新建文件夹
    aList.eq(4).click(function () {
        createDirBtn.click();
    })
    /*移入高亮h2*/
    aList.each(function(){
        $(this).hover(function () {
                var aUl = this.children[1];
                var aH2 = this.children[0];
                if (aUl) {//移入li下有ul则显示
                    aUl.style.display = 'block';
                }
                aH2.className = 'active';
        },
            function () {
                var aUl = this.children[1];
                var aH2 = this.children[0];
                if (aUl) {//移入li下有ul则显示
                    aUl.style.display = '';
                }
                aH2.className = ''
        })

    });

    //切换文档排列方式
    switchBtn.click(function (ev) {
        if (ev.target.className == 'list-switch') {//列表
            $(this).addClass('list-switched-on').removeClass('grid-switched-on');//替换class
            listSwitch();
        } else {//缩略图
            $(this).addClass('grid-switched-on').removeClass('list-switched-on');//替换class
            gridSwitch();
        };
        Child.html(0);
      ;
    });
    //列表
    function listSwitch(){
        moduleView.children().addClass('module-list-view').removeClass('module-grid-view');
        newFile.addClass('new-list-file').removeClass('new-grid-file');
        modeDisplay = false;
        renderList(getChildren(folderId));
    }
    //缩略图
    function gridSwitch(){
        moduleView.children().addClass('module-grid-view').removeClass('module-list-view');
        newFile.addClass('new-grid-file').removeClass('new-list-file');
        modeDisplay = true;
        renderList(getChildren(folderId));
    }

    //模拟placeholder方法
    searchForm.keydown(function () {
        setTimeout(function () {
            if (searchForm.val() == '') {//如果搜索框为空
                promptSpan.show();//显示提示信息
            } else {//搜索框不为空
                promptSpan.hide();//隐藏提示信息
            }
        }, 10)
    });
    //左侧导航点击效果
    asideList.click(function () {//给当前点击li的子元素a添加class,移出其他
        $(this).find('a').addClass('active').end()
            .siblings().find('a').removeClass('active');
    })
    //运动头部导航top值
    cloudHeader.animate({top: '0'}, 1000);






    //获取制定下的所有一级子文件
    function getChildren(pid) {
        var pid = pid || 0;
        var data = [];
        $.each(filesData, function (i) {
            if (filesData[i].pid == pid) {//相等则加入到数租返回
                data.push(filesData[i]);
            }
        });
        return data;
    }

    //根据数据动态渲染list
    function renderList(data) {
        list.empty();
        // fileNum=data.length;
        listTips.text('已全部加载，共' + data.length + '个');//加载文件数量
        $.each(data, function (i) {
            var li = $('<li>');
            if (data[i].pid == 0) {//如果已经是最外层文档，返回上一级按钮隐藏
                prevBtn.hide();
            }
            //需要拼接的字符串
            var str = '';
            if (modeDisplay) {
                str = '<div class="grid-view-item">' +
                '<div class="fileicon ' + data[i].classname[0] + '">' +
                '<span class="item-checkbox"></span></div>' +
                '<div class="file-name">' +
                '<a href="javascript:;" style="display: block;">' + data[i].name + '</a>' +
                '</div></div>';
            } else {
                str = '<div class="list-view-item">' +
                '<div class="fileicon ' + data[i].classname[1] + '">' +
                '<span class="item-checkbox"></span></div>' +
                '<div class="file-name">' +
                '<a href="javascript:;" style="display: block;">' + data[i].name + '</a>' +
                '</div></div>';
            }

            li.html(str);
            li.attr({
                fileType: data[i].type,
                fileId: data[i].id
            });
            li.dblclick(fileDbClick);//双击执行函数
            list.append(li);

        });
        folderBasies();//生成时调用函数
        $('#checkAll').removeClass('checked');//移除全选的选中状态
    }

    function folderBasies() {
        fileEicon = $('.module-views li').children();
        //文档的hover和active
        fileEicon.hover(function () {//移入自身添加class，子元素span显示
                $(this).addClass("item-hover");
            },
            function () {//移出自身移出class，子元素span隐藏
                $(this).removeClass("item-hover");
            }
        ).mousedown(function () {
                return false;//阻止鼠标按下冒泡
            }).find('.item-checkbox').click(function () {//span点击时切换文档边框的class
                $(this).parents('li').children().toggleClass('item-active');
                isAllCheck();//是否全选调用
            }).dblclick(function () {
                return false;//阻止双击时冒泡
            });


        //是否全选函数
        function isAllCheck() {
            if (fileEicon.filter('.item-active').size() == fileEicon.length) {
                checkAll.addClass('checked');//文档全部选中时，checkAll为选中状态
            } else {
                checkAll.removeClass('checked');//有一个没选中，checkAll则不选中
            }
            fileNum = fileEicon.filter('.item-active').size();
            Child.html(fileNum);
        }


        //碰撞检测
        dragTest();
        function dragTest() {
            //鼠标可移动的区域的最小坐标
            var minX = moduleView.offset().left;//用于限制碰撞层的x轴坐标
            var minY = moduleView.offset().top;//用于限制碰撞层的y轴坐标
            moduleView.mousedown(function (ev) {
                var disX = ev.pageX;
                var disY = ev.pageY;
                //isAllCheck();//是否全选调用

                //当鼠标按下的时候把box定位在鼠标按下的位置。并且显示。
                dragBox.css({
                    display: 'block',
                    left: disX + 'px',
                    top: disY + 'px'
                });
                $(document).mousemove(function (ev) {
                    var X = ev.pageX, Y = ev.pageY;
                    if (X <= minX) {//如果鼠标移动x轴坐标超出限制区域则等于最小坐标
                        X = minX;
                    }
                    if (Y <= minY) {//如果鼠标移动y轴坐标超出限制区域则等于最小坐标
                        Y = minY;
                    }
                    //新的鼠标位置减去按下的时候鼠标的位置。这个差值可以当作高度，宽度，还有定位值来用。
                    var x = X - disX;
                    var y = Y - disY;
                    //y<0代表向上拉。
                    if (y < 0) {
                        //要减掉对应的top值。
                        dragBox.css({
                            'top': (disY + y) + 'px'
                        })
                    }
                    //代表向左拉
                    if (x < 0) {
                        //要减掉对应的left值。
                        dragBox.css({
                            'left': (disX + x) + 'px'
                        })
                    }

                    dragBox.css({
                        'width': Math.abs(x) + 'px',
                        'height': Math.abs(y) + 'px'
                    })

                    //检测碰撞
                    fileEicon.each(function (i) {
                        if (isDrag(dragBox, fileEicon.eq(i))) {
                            $(this).addClass('item-active');
                            isAllCheck();//是否全选调用
                        } else {
                            $(this).removeClass('item-active');
                        }
                    })

                }).mouseup(function () {
                    $(this).off('mousemove');
                    dragBox.removeAttr('style');//清空样式
                })
                return false;
            })

        }

    }


    //文件被双击以后要处理的函数
    function fileDbClick() {
        switch ($(this).attr('fileType')) {
            case '':
                folderId = $(this).attr('fileId');
                var children = getChildren(folderId);
                renderList(children);
                prevBtn.show();//返回上一级按钮显示
                break;
            case 'txt':
                break;

            case 'mp4':
                break;

            case 'mp3':
                break;

            case 'ppt':
                break;
        }
    }

     //检测是否碰撞
        function isDrag(ele1, ele2) {

            var
                L1 = ele1.offset().left,
                R1 = L1 + ele1.width(),
                T1 = ele1.offset().top,
                B1 = T1 + ele1.height(),

                L2 = ele2.offset().left,
                R2 = L2 + ele2.width(),
                T2 = ele2.offset().top,
                B2 = T2 + ele2.height();

            return !(L1 > R2 || R1 < L2 || T1 > B2 || B1 < T2);

        }
}