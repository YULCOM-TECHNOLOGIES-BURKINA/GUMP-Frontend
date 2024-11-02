import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer-container bg-gray-900 text-white py-8 px-6 mt-8">
      <div class="grid justify-content-center align-items-center gap-6 lg:gap-12">
        <!-- Logo and Title Section -->
        <div class="col-12 md:col-3 text-center md:text-left">
          <a href="/" class="flex flex-wrap align-items-center justify-content-center md:justify-content-start mb-6 md:mb-0">
            <img src="assets/image.png" alt="logo guichet" width="125" height="150" class="mr-3">
            <h5 class="font-bold text-4xl text-white">Guichet Unique des Marchés Publics</h5>
          </a>
        </div>

        <!-- Links Section -->
        <div class="col-12 md:col-10 lg:col-7">
          <div class="grid text-center md:text-left">
            <!-- External Links -->
            <div class="col-12 md:col-4">
              <h4 class="font-bold text-2xl mb-4 text-white">Liens externes</h4>
              <ul class="space-y-3">
                <li><a href="https://www.fonction-publique.gov.bf/" class="text-lg hover:text-gray-300 transition">DRTSS</a></li>
                <li><a href="https://eservices.cnss.bf/" class="text-lg hover:text-gray-300 transition">e-CNSS</a></li>
                <li><a href="https://justice.gov.bf" class="text-lg hover:text-gray-300 transition">Justice</a></li>
                <li><a href="https://esintax.bf/" class="text-lg hover:text-gray-300 transition">eSINTAX</a></li>
              </ul>
            </div>

            <!-- Official Sites -->
            <div class="col-12 md:col-4 mt-6 md:mt-0">
              <h4 class="font-bold text-2xl mb-4 text-white">Sites officiels</h4>
              <ul class="space-y-3">
                <li><a href="https://finances.gov.bf" class="text-lg hover:text-gray-300 transition">Ministère en charge des finances</a></li>
                <li><a href="https://dgcmef.gov.bf/" class="text-lg hover:text-gray-300 transition">DGCMEF</a></li>
                <li><a href="https://dgi.bf" class="text-lg hover:text-gray-300 transition">DGI</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider Line -->
      <div class="my-6 border-t border-gray-600"></div>

      <!-- Footer Bottom Section -->
      <div class="text-center text-sm lg:text-base font-medium">
        &copy; 2024 - Guichet Unique des Marchés Publics <span class="font-semibold"> - MEFP</span>
      </div>
    </div>
  `,
  styles: `
     .footer-container {
        background-color: #1f2937; /* Dark gray */
        color: #f3f4f6; /* Light gray text */
    }

    .footer-container a {
        color: #f3f4f6;
        transition: color 0.3s ease;
    }

    .footer-container a:hover {
        color: #a1a1aa; /* Hover color */
    }

    .footer-container h5, .footer-container h4 {
        letter-spacing: 1px;
    }

    .footer-container ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .footer-container ul li {
        padding-bottom: 0.5rem;
    }

    .footer-container img {
        transition: transform 0.3s ease;
    }

    .footer-container a:hover img {
        transform: scale(1.05);
    }

    .footer-container .border-t {
        border-top: 1px solid #4b5563; /* Light border color */
    }
`
})
export class FooterComponent {}