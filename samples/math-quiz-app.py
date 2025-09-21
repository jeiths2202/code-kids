# 수학 퀴즈 앱 - 메인 실행 파일
# 작성자: 이지은 (초등학교 6학년)
# 작성일: 2024.12.10
#
# 이 파일은 CodeKids 플랫폼의 학생 작품인 수학 퀴즈 앱의 파이썬 소스코드입니다.
# 실제 실행을 위해서는 Python 3.x와 tkinter 모듈이 필요합니다.

import tkinter as tk
from tkinter import messagebox
import random
import json
from datetime import datetime

class MathQuizApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("수학 퀴즈 앱 - CodeKids")
        self.root.geometry("600x500")
        self.root.configure(bg="#f0f8ff")

        # 게임 상태 변수
        self.score = 0
        self.current_question = None
        self.difficulty = 1
        self.question_count = 0
        self.total_questions = 10

        self.setup_ui()
        self.load_user_data()

    def setup_ui(self):
        """UI 구성 요소 설정"""
        # 제목
        title_label = tk.Label(
            self.root,
            text="🧮 수학 퀴즈 앱",
            font=("맑은 고딕", 24, "bold"),
            bg="#f0f8ff",
            fg="#2c3e50"
        )
        title_label.pack(pady=20)

        # 점수 표시
        self.score_label = tk.Label(
            self.root,
            text=f"점수: {self.score}",
            font=("맑은 고딕", 16),
            bg="#f0f8ff",
            fg="#27ae60"
        )
        self.score_label.pack()

        # 문제 표시 영역
        self.question_frame = tk.Frame(self.root, bg="#ffffff", relief="raised", bd=2)
        self.question_frame.pack(pady=20, padx=40, fill="both", expand=True)

        self.question_label = tk.Label(
            self.question_frame,
            text="시작 버튼을 눌러 퀴즈를 시작하세요!",
            font=("맑은 고딕", 18),
            bg="#ffffff",
            fg="#2c3e50",
            wraplength=400
        )
        self.question_label.pack(pady=40)

        # 답안 입력
        self.answer_entry = tk.Entry(
            self.root,
            font=("맑은 고딕", 16),
            justify="center",
            width=15
        )
        self.answer_entry.pack(pady=10)
        self.answer_entry.bind("<Return>", self.check_answer)

        # 버튼 프레임
        button_frame = tk.Frame(self.root, bg="#f0f8ff")
        button_frame.pack(pady=20)

        # 시작 버튼
        self.start_btn = tk.Button(
            button_frame,
            text="🚀 퀴즈 시작",
            font=("맑은 고딕", 14, "bold"),
            bg="#3498db",
            fg="white",
            padx=20,
            pady=10,
            command=self.start_quiz
        )
        self.start_btn.pack(side="left", padx=5)

        # 답안 제출 버튼
        self.submit_btn = tk.Button(
            button_frame,
            text="✓ 답안 제출",
            font=("맑은 고딕", 14),
            bg="#27ae60",
            fg="white",
            padx=20,
            pady=10,
            command=self.check_answer,
            state="disabled"
        )
        self.submit_btn.pack(side="left", padx=5)

        # 다음 문제 버튼
        self.next_btn = tk.Button(
            button_frame,
            text="▶ 다음 문제",
            font=("맑은 고딕", 14),
            bg="#e67e22",
            fg="white",
            padx=20,
            pady=10,
            command=self.next_question,
            state="disabled"
        )
        self.next_btn.pack(side="left", padx=5)

    def start_quiz(self):
        """퀴즈 시작"""
        self.score = 0
        self.question_count = 0
        self.difficulty = 1
        self.update_score()
        self.start_btn.config(state="disabled")
        self.submit_btn.config(state="normal")
        self.next_question()

    def generate_question(self):
        """난이도에 따른 수학 문제 생성"""
        operations = ['+', '-', '*', '/']
        operation = random.choice(operations)

        if self.difficulty == 1:
            # 쉬움: 한 자리 수
            num1 = random.randint(1, 9)
            num2 = random.randint(1, 9)
        elif self.difficulty == 2:
            # 보통: 두 자리 수
            num1 = random.randint(10, 99)
            num2 = random.randint(1, 99)
        elif self.difficulty == 3:
            # 어려움: 세 자리 수
            num1 = random.randint(100, 999)
            num2 = random.randint(1, 99)
        else:
            # 매우 어려움: 큰 수
            num1 = random.randint(100, 9999)
            num2 = random.randint(10, 999)

        # 나눗셈의 경우 나머지가 없도록 조정
        if operation == '/':
            num1 = num2 * random.randint(1, 20)

        # 뺄셈의 경우 음수가 나오지 않도록 조정
        if operation == '-' and num1 < num2:
            num1, num2 = num2, num1

        return num1, num2, operation

    def calculate_answer(self, num1, num2, operation):
        """정답 계산"""
        if operation == '+':
            return num1 + num2
        elif operation == '-':
            return num1 - num2
        elif operation == '*':
            return num1 * num2
        elif operation == '/':
            return num1 // num2

    def next_question(self):
        """다음 문제 생성 및 표시"""
        if self.question_count >= self.total_questions:
            self.end_quiz()
            return

        self.question_count += 1
        num1, num2, operation = self.generate_question()
        self.current_question = {
            'num1': num1,
            'num2': num2,
            'operation': operation,
            'answer': self.calculate_answer(num1, num2, operation)
        }

        question_text = f"문제 {self.question_count}/{self.total_questions}\n\n"
        question_text += f"{num1} {operation} {num2} = ?"

        self.question_label.config(text=question_text)
        self.answer_entry.delete(0, tk.END)
        self.answer_entry.focus()
        self.next_btn.config(state="disabled")

        # 난이도 자동 조정
        if self.question_count % 3 == 0 and self.difficulty < 4:
            self.difficulty += 1

    def check_answer(self, event=None):
        """답안 확인"""
        try:
            user_answer = int(self.answer_entry.get())
            correct_answer = self.current_question['answer']

            if user_answer == correct_answer:
                self.score += 10 * self.difficulty
                messagebox.showinfo("정답!", f"🎉 정답입니다!\n+{10 * self.difficulty}점")
            else:
                messagebox.showwarning("오답", f"❌ 틀렸습니다.\n정답: {correct_answer}")

            self.update_score()
            self.next_btn.config(state="normal")
            self.submit_btn.config(state="disabled")

        except ValueError:
            messagebox.showerror("입력 오류", "숫자를 입력해주세요!")

    def update_score(self):
        """점수 업데이트"""
        self.score_label.config(text=f"점수: {self.score} | 난이도: {self.difficulty}")

    def end_quiz(self):
        """퀴즈 종료"""
        final_message = f"퀴즈 완료!\n\n"
        final_message += f"최종 점수: {self.score}점\n"
        final_message += f"평균 점수: {self.score/self.total_questions:.1f}점"

        if self.score >= 80:
            final_message += "\n\n🏆 훌륭합니다!"
        elif self.score >= 60:
            final_message += "\n\n👍 잘했어요!"
        else:
            final_message += "\n\n💪 더 연습해보세요!"

        messagebox.showinfo("퀴즈 완료", final_message)

        # 게임 초기화
        self.start_btn.config(state="normal")
        self.submit_btn.config(state="disabled")
        self.next_btn.config(state="disabled")
        self.question_label.config(text="시작 버튼을 눌러 퀴즈를 시작하세요!")
        self.answer_entry.delete(0, tk.END)

        self.save_user_data()

    def load_user_data(self):
        """사용자 데이터 로드"""
        try:
            with open('user_data.json', 'r', encoding='utf-8') as f:
                self.user_data = json.load(f)
        except FileNotFoundError:
            self.user_data = {
                'total_games': 0,
                'best_score': 0,
                'total_score': 0
            }

    def save_user_data(self):
        """사용자 데이터 저장"""
        self.user_data['total_games'] += 1
        self.user_data['total_score'] += self.score
        if self.score > self.user_data['best_score']:
            self.user_data['best_score'] = self.score

        with open('user_data.json', 'w', encoding='utf-8') as f:
            json.dump(self.user_data, f, ensure_ascii=False, indent=2)

    def run(self):
        """앱 실행"""
        self.root.mainloop()

if __name__ == "__main__":
    app = MathQuizApp()
    app.run()

# 프로젝트 실행 방법:
# 1. Python 3.x 설치 확인
# 2. 터미널에서 다음 명령어 실행: python math-quiz-app.py
# 3. GUI 창이 열리면 "퀴즈 시작" 버튼을 클릭하여 게임 시작
#
# 주요 기능:
# - 4가지 연산 (덧셈, 뺄셈, 곱셈, 나눗셈) 지원
# - 난이도 자동 조정 시스템
# - 점수 추적 및 통계 저장
# - 사용자 친화적인 GUI 인터페이스