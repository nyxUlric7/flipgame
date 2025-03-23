        
        let uploadedImages = [];
        let selectedCards = [];
        let matchedPairs = 0;
        let countFlip = 0;
        let timeDefault = 10;
        let timeLeft = timeDefault;
                
        function toggleElement(idToShow, idToHide) {
            document.getElementById(idToShow).classList.toggle('hidden');
            document.getElementById(idToHide).classList.add('hidden'); // Pastikan elemen lain tersembunyi
        }
                
        function openSettings() {
            document.getElementById('settings').classList.toggle('hidden');            
        }

        function applySettings() {            
            
            generateGameBoard();
            matchedPairs = 0;
            countFlip = 0;
            document.getElementById('flipCount').textContent = countFlip;
            const titleInput = document.getElementById('titleInput').value;
            document.getElementById('gameTitle').innerText = titleInput;
        }

        function generateGameBoard() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '';
            if (uploadedImages.length < 2) {
                //alert('Silakan unggah minimal 2 gambar.');
                showModal("Perhatikan","Silahkan unggah minimal 2 gambar");
                return;
            }
            let totalPairs = uploadedImages.length;
            let bombCount = Math.floor(totalPairs / 3); 
            let totalCards = (totalPairs * 2) + bombCount; // Total kartu termasuk bom
            
            let bombImage = "https://i.ibb.co.com/d00nWHGw/bom.png";

            let allCards = [...uploadedImages, ...uploadedImages]; // Duplikasi gambar untuk pasangan
    
            // Tambahkan bom secara acak
            for (let i = 0; i < bombCount; i++) {
                allCards.push(bombImage);
            }
             
            let maxColumns = 10; // Maksimum lebar grid
            let gridColumns = Math.min(Math.ceil(totalCards / 3), maxColumns);

            gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 100px)`;

            //let shuffledImages = [...uploadedImages, ...uploadedImages].sort(() => 0.5 - Math.random());
            let shuffledImages = allCards.sort(() => 0.5 - Math.random());
            
            shuffledImages.forEach((image, index) => {
                let card = document.createElement('div');
                card.classList.add('card');
                card.dataset.image = image;
                card.dataset.index = index;
                
                let cardInner = document.createElement('div');
                cardInner.classList.add('card-inner');
                
                let cardFront = document.createElement('div');
                cardFront.classList.add('card-front');
                cardFront.textContent = index + 1;
                
                let cardBack = document.createElement('div');
                cardBack.classList.add('card-back');
                
                let img = document.createElement('img');
                img.src = image;
                img.onclick = () => openLightbox(image);
                cardBack.appendChild(img);
                
                cardInner.appendChild(cardFront);
                cardInner.appendChild(cardBack);
                card.appendChild(cardInner);
                
                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
            });
        }

        function flipCard() {
            if (selectedCards.length < 2 && !this.classList.contains('flipped')) {
                this.classList.add('flipped');
                document.getElementById('flipSound').play();
                selectedCards.push(this);

                // Cek apakah kartu yang dipilih adalah bom
                if (this.dataset.image === "https://i.ibb.co.com/d00nWHGw/bom.png") {
                    setTimeout(() => {
                        showModal("Duaarr", "Poin kamu dikurangi");
                        //alert("Kamu memilih bom! Pilihan direset.");
                        this.classList.add('bomb-revealed'); // Tambahkan kelas agar tetap terbuka
                        this.removeEventListener('click', flipCard); // Nonaktifkan klik pada bom yang sudah terbuka
                        selectedCards.forEach(card => {
                            if (!card.classList.contains('bomb-revealed')) {
                                card.classList.remove('flipped');
                            }
                        });
                        selectedCards = [];
                    }, 500); // Delay agar animasi flip muncul sebelum alert
                    return;
                }
                
            }
            if (selectedCards.length === 2) {
                countFlip++;
                document.getElementById('flipCount').textContent = countFlip;
                console.log("Count Flip:", countFlip);
                setTimeout(checkMatch, 500);
            }
        }

        function checkMatch() {
            if (selectedCards[0].dataset.image === selectedCards[1].dataset.image) {
                selectedCards.forEach(card => card.classList.add('matched'));
                document.getElementById('matchSound').play();
                matchedPairs++;
                console.log("Matched Pairs:", matchedPairs);
                if (matchedPairs === uploadedImages.length) {
                    document.getElementById('winSound').play();
                    setTimeout(() => {
                        showModal("Selamat!", "Kamu berhasil menyelesaikan game!");                     
                    }, 500); // Delay agar alert muncul setelah efek lainnya selesai
                }
            } else {
                selectedCards.forEach(card => card.classList.remove('flipped'));
            }
            selectedCards = [];
        }

        function openLightbox(imageSrc) {
            if (!document.querySelector(`[data-image='${imageSrc}']`).classList.contains('matched')) return;
            document.getElementById('lightboxImg').src = imageSrc;
            document.getElementById('lightbox').style.display = 'flex';
        }

        function closeLightbox() {
            document.getElementById('lightbox').style.display = 'none';
        }
        
        document.getElementById('imageUpload').addEventListener('change', function(event) {
            uploadedImages = [];
            Array.from(event.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = e => uploadedImages.push(e.target.result);
                reader.readAsDataURL(file);
            });
        });      
         
        //Timer
        let countdown = null;
        
        function adjustTime(value) {
            timeDefault += value;
            if (timeDefault < 1) timeDefault = 1; // Minimal 1 detik
            document.getElementById("timerDisplay").innerText = timeDefault;
        }

        function startCountdown() {
            
            let timeLeft = timeDefault;
            //let timeLeft = 10; // Waktu awal dalam detik
            document.getElementById("timerDisplay").innerText = timeLeft;

            // Hentikan countdown sebelumnya jika ada
            clearInterval(countdown);

            // Mulai countdown baru
            countdown = setInterval(() => {
                timeLeft--;
                document.getElementById("timerDisplay").innerText = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(countdown);                    
                    document.getElementById("timerDisplay").innerText = "Waktu Habis";

                    // Setelah 1 detik, kembali ke nilai timeDefault
                    setTimeout(() => {
                        document.getElementById("timerDisplay").innerText = timeDefault;
                    }, 1000);
                }
            }, 1000);
        }
        // Menjalankan startCountdown() saat tombol spasi ditekan
        document.addEventListener("keydown", function(event) {
            if (event.code === "Space") {
                startCountdown();
            }
        });

        setTimeout(() => {
            document.getElementById("tooltip").classList.add("opacity-0");
        }, 3000);


        // Modal
        function showModal(judul, message) {
            document.getElementById("announcementJudul").innerText = judul;
            document.getElementById("announcementText").innerText = message;
            document.getElementById("announcementModal").classList.remove("hidden");
        }

        function closeModal() {
            document.getElementById("announcementModal").classList.add("hidden");
        }


        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
        }, false);

        document.addEventListener("keydown", function(e) {
            if (e.ctrlKey && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S" || e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J")) {
                e.preventDefault();
            }
            /*if (e.key === "F12") {
                e.preventDefault();
            }*/
        }, false);
