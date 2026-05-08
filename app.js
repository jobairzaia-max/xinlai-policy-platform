const kpis = [
  { name: '服务客户数', value: '1,024' },
  { name: '本月凭证数', value: '28,541' },
  { name: '待对账流水', value: '389' },
  { name: '异常工单', value: '7' },
];

const cards = document.getElementById('kpiCards');
kpis.forEach((item) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `<h4>${item.name}</h4><p>${item.value}</p>`;
  cards.appendChild(card);
});

document.getElementById('newVoucherBtn').addEventListener('click', () => {
  alert('示例：下一步可接入 /api/v1/journal-entries 创建凭证接口。');
});
