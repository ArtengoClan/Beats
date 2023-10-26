const humburgerPlank = document.querySelector('.humburger');
const fullscreenMenu = document.querySelector('.fullscreen-menu');
const humburgerCross = document.querySelector('.menu-btn');
const modal = document.querySelector('#modal');
const modalClose = document.querySelector('.app-close-modal');

humburgerPlank.addEventListener('click',(e) => {
    e.preventDefault()
    fullscreenMenu.classList.add('active')
});

humburgerCross.addEventListener('click',(e) => {
    fullscreenMenu.classList.remove('active')
})

    // tabs 
    const findBlockByAlias = (alias) => {
        return $('.reviews__item').filter((ndx,item) => {
            return $(item).attr('data-linked-with') === alias;
        });
    };
    
    $('.interactive-avatar__link').click(e => {
        e.preventDefault();
        const $this = $(e.currentTarget);
        const target = $this.attr('data-open'); 
        const itemToShow = findBlockByAlias(target);
        const curItem = $this.closest('.reviews__switcher-item');
    
        itemToShow.addClass('active').siblings().removeClass('active');
        curItem.addClass('interactive-avatar--active').siblings().removeClass('interactive-avatar--active');
    });

    //acco
    const openItem = item => {
        const container = item.closest('.team__item');
        const contentBlock = container.find('.team__content');
        const textBlock = contentBlock.find('.team__content-block');
        const arrow = container.find('.team__title');
        const reqHeight = textBlock.height();

        arrow.removeClass('team__title-open');
        arrow.addClass('team__title-close');
        container.addClass('active');
        contentBlock.height(reqHeight);
    }

    const closeEveryItem = container => {
        const items = container.find('.team__content');
        const itemContainer = container.find('.team__item');
        const arrow = container.find('.team__title');

        arrow.addClass('team__title-open');
        arrow.removeClass('team__title-close');
        itemContainer.removeClass('active');
        items.height(0);
    }

    $('.team__title').click(e => {
        const $this = $(e.currentTarget);
        const container = $this.closest('.team');
        const elemContainer = $this.closest('.team__item');

        if (elemContainer.hasClass('active')) {
            closeEveryItem(container);
        } else {
            closeEveryItem(container);
            openItem($this);
        }
    })

    //slider
    const slider = $(".product").bxSlider({
        pager: false,
        controls: false,
        wrapperClass: ''
    });

    $('.product-slider__arrow--direction--prev').click(e => {
        e.preventDefault();
        slider.goToPrevSlide();
    });
    $('.product-slider__arrow--direction--next').click(e => {
        e.preventDefault();
        slider.goToNextSlide();
    });

//modal
const validateFields = (form, fieldsArray) => {
    fieldsArray.forEach((field) => {
        field.removeClass('input-error');
        if (field.val().trim() === '') {
            field.addClass('input-error');
        }
    });

    const errorFields = form.find('.input-error');

    return errorFields.length === 0;
}

$('.form').submit(e => {
    e.preventDefault();

    const form = $(e.currentTarget);
    const name = form.find('[name="name"]')
    const phone = form.find('[name="phone"]')
    const comment = form.find('[name="comment"]')
    const to = form.find('[name="to"]')

    const modalQ = $('#modal');
    const content = modalQ.find('.modal__content');

    const isValid = validateFields(form, [name, phone, comment, to])

    if (isValid) {
        const request = $.ajax({
            url: 'https://webdev-api.loftschool.com/sendmail',
            method: 'post',
            dataType: "html",
            data: {
                name:name.val(),
                phone:phone.val(),
                comment:comment.val(),
                to:to.val(),
            },
        })

        request.done(() => {
            content.text('Отправка удалась')
            modal.classList.add('active');
        })

        request.fail(() => {
            content.text('Произошла ошибка')
            modal.classList.add('active');
        })
    }

    
})

// modalClose 
modalClose.addEventListener('click',() => {
    modal.classList.remove('active')
})

//menu-acco
const mesureWidth = item => {
    let reqItemWidth = 0;

    const screenWidth = $(window).width();
    const container = item.closest('.products-menu');
    const titlesBlocks = container.find('.products-menu__title');
    const titleWidth = titlesBlocks.width() * titlesBlocks.length;

    const textContainer = item.find('.products-menu__container');
    const paddingLeft = parseInt(textContainer.css('padding-left'));
    const paddingRight = parseInt(textContainer.css('padding-right'));

    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (isMobile) {
        reqItemWidth = screenWidth - titleWidth
    }else {
        reqItemWidth = 500
    }
    return {
        container: reqItemWidth,
        textContainer: reqItemWidth - paddingLeft - paddingRight
    }
}

const closeEveryItemInContainer = container => {
    const items = container.find('.products-menu__item');
    const content = container.find('.products-menu__content');

    items.removeClass('active');
    content.width(0)
}

const openItems = item => {
    const hiddenContent = item.find('.products-menu__content');
    const reqWidth = mesureWidth(item);
    const textBlock = item.find('.products-menu__container');

    item.addClass('active');
    hiddenContent.width(reqWidth.container);
    textBlock.width(reqWidth.textContainer);
}

$('.products-menu__title').on('click', e => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const item = $this.closest('.products-menu__item');
    const itemOpened = item.hasClass('active');
    const container = $this.closest('.products-menu');

    if (itemOpened) {
        closeEveryItemInContainer(container)
    }else {
        closeEveryItemInContainer(container)
        openItems(item);
    }
})

//ops
const sections = $('section');
const display = $('.maincontent');

let inScroll = false;

sections.first().addClass('active');

const performTransition = sectionEq => {
    if (inScroll === false) {
        inScroll = true;
        const position = sectionEq * -100;
    
        const currentSection = sections.eq(sectionEq);
        const menuTheme = currentSection.attr('data-sidemenu-theme');
        const sideMenu = $('.fixed-menu');

        if (menuTheme === 'black') {
            sideMenu.addClass('fixed-menu--shadow')
        } else {
            sideMenu.removeClass('fixed-menu--shadow')
        }

        display.css({
            transform: `translateY(${position}%)`
        });
    
        sections.eq(sectionEq).addClass('active').siblings().removeClass('active');
        
        setTimeout(() => {
            inScroll = false;

            sideMenu.find('.fixed-menu__item').eq(sectionEq).addClass('fixed-menu__item--active').siblings().removeClass('fixed-menu__item--active');

        }, 1300);
    }
}

const scrollViewport = direction => {
    const activeSection = sections.filter('.active');
    const nextSection = activeSection.next();
    const prevSection = activeSection.prev();

    if (direction === 'next' && nextSection.length) {
        performTransition(nextSection.index())
    }
    
    if (direction === 'prev' && prevSection.length) {
        performTransition(prevSection.index())
    }
}

$(window).on('wheel', e => {
    const deltaY = e.originalEvent.deltaY;

    if (deltaY > 0) {
        scrollViewport('next');
    }

    if (deltaY < 0) {
        scrollViewport('prev');
    }
})

$(window).on('keydown', e => {

    const tagName = e.target.tagName.toLowerCase();

    // if (tagName !== 'input' && tagName !== 'textarea') 


    switch (e.keyCode) {
        case 38:
            scrollViewport('prev');
            break;
        case 40:
            scrollViewport('next');
            break;
    }

})

$('.wrapper').on('touchmove', e => e.preventDefault)

// Навигация по ссылкам
$('[data-scroll-to]').click(e => {
    e.preventDefault();

    const $this = $(e.currentTarget);
    const target = $this.attr('data-scroll-to');
    const reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());
})

$('body').swipe({
    swipe: function (event,direction){
        let scrollDirection = '';

        if (direction === 'up') scrollDirection = 'next';
        if (direction === 'down') scrollDirection = 'prev';

        scrollViewport(scrollDirection);
    }
})
