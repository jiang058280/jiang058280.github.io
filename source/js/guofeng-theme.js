/* Runs in the head, before paint. One preference model for initial loads and PJAX. */
(function () {
  'use strict';
  if (window.gfTheme) return;
  var choice = 'auto', motion = false;
  try { choice = localStorage.getItem('gf-theme') || 'auto'; motion = localStorage.getItem('gf-motion') === 'off'; } catch (_) {}
  if (!['auto', 'light', 'dark'].includes(choice)) choice = 'auto';
  function apply(page) {
    var root = document.documentElement;
    var type = page || root.dataset.gfPage || 'content';
    var theme = choice === 'auto' ? 'light' : choice;
    root.setAttribute('data-theme', theme);
    root.dataset.gfMotion = motion ? 'off' : 'on';
    document.querySelectorAll('[data-theme-choice]').forEach(function (el) { el.value = choice; });
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-motion]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(!motion && !reduced));
      el.textContent = reduced ? '系统静止' : motion ? '动态：关' : '动态：开';
      el.title = reduced ? '系统启用了减少动态，动画保持关闭' : motion ? '点击开启云雾与水光' : '云雾与水光已开启，点击关闭';
    });
  }
  window.gfTheme = {
    apply: apply,
    set: function (value) { choice = value; try { localStorage.setItem('gf-theme', value); } catch (_) {} apply(); },
    toggleMotion: function () { motion = !motion; try { localStorage.setItem('gf-motion', motion ? 'off' : 'on'); } catch (_) {} apply(); }
  };
  if (window.matchMedia) window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',function () { apply(); });
  apply();
})();
