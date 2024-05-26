<template>
    <div class="faq">
      <div class="header">
        <h1>Часті питання (FAQ)</h1>
      </div>
      
      <section class="question">
        <h2>Що таке Game Treasure?</h2>
        <p>Game Treasure — це інтернет-магазин, де ви можете придбати ігрові цінності, такі як внутрішньоігрові предмети, валюта та багато іншого для різних ігор.</p>
      </section>
  
      <section class="question">
        <h2>Як я можу створити обліковий запис?</h2>
        <p>Щоб створити обліковий запис, натисніть на кнопку "Увійти" у верхньому правому куті сторінки, після чого під авторизацією буде кнопка "Зареєструватися" та заповніть необхідну інформацію. Після цього ви зможете увійти у свій обліковий запис.</p>
      </section>
  
      <section class="question">
        <h2>Як я можу здійснити покупку?</h2>
        <p>Виберіть потрібні вам товари та додайте їх до кошика. Потім перейдіть до кошика, щоб перевірити своє замовлення, і натисніть "Оформити замовлення". Дотримуйтесь інструкцій для завершення покупки.</p>
      </section>
  
      <section class="question">
        <h2>Які способи оплати ви приймаєте?</h2>
        <p>Ми приймаємо різні способи оплати, включаючи кредитні та дебетові картки  та інші електронні платіжні системи. Детальний список доступний під час оформлення замовлення.</p>
      </section>
  
      <section class="question">
        <h2>Чи можу я повернути або обміняти товар?</h2>
        <p>Так, але для цього вам потрібно зв'язатися з нами електронною поштою та надати докази того, що товар не працює належним чином.</p>
          </section>
      <section class="question">
        <h2>Як я можу зв'язатися з підтримкою клієнтів?</h2>
        <p>Якщо у вас виникли питання або проблеми, ви можете зв'язатися з нашою підтримкою клієнтів, надіславши електронного листа на адресу <a href="mailto:support@gametreasure.com">support@gametreasure.com</a> </p>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FAQ'
  }
  </script>
  
  <style scoped>
  .faq {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Roboto', sans-serif;
    line-height: 1.6;
    color: #444;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .faq .header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .faq h1 {
    font-size: 2.5em;
    color: #222;
  }
  
  .faq h2 {
    font-size: 1.75em;
    color: #333;
    margin-top: 1.5em;
  }
  
  .faq p {
    margin: 1em 0;
  }
  
  .faq a {
    color: #007BFF;
    text-decoration: none;
  }
  
  .faq a:hover {
    text-decoration: underline;
  }
  </style>
  